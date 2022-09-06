type itemSizeGetter = (index: number) => number;
interface SizeAndPosition {
  size: number;
  offset: number;
  top?: number;
  bottom?: number;
  index?: number;
  height?: number;
  dValue?: number;
}
interface options {
  itemCount: number;
  itemSizeGetter: itemSizeGetter;
  estimatedItemSize: number;
}
interface SizeAndPositionData {
  [id: number]: SizeAndPosition;
}
interface CachedPosition {
  index: number;
  top: number;
  bottom: number;
  height: number;
  dValue: number;
}
export class SizeAndPosManager {
  private itemSizeGetter: itemSizeGetter;
  private itemCount: number; // 元素数量
  private estimatedItemSize: number; // 单个元素的预估尺寸，在没有给的情况下默认等于itemSize尺寸
  private lastMeasuredIndex: number; // 视图的最后一个元素的index
  private itemSizeAndPositionData: SizeAndPositionData; // 单个元素的位置和尺寸信息，用于处理列表项的高度不是统一的情况
  public cachedPositions: CachedPosition[] = [];
  constructor({ itemCount, itemSizeGetter, estimatedItemSize }: options) {
    this.itemSizeGetter = itemSizeGetter; // 兼容size传递函数过来的情况
    this.itemCount = itemCount;
    this.estimatedItemSize = estimatedItemSize;
    this.lastMeasuredIndex = -1;
    this.itemSizeAndPositionData = []; // 保存每个item的size和位置信息
  }
  binarySearch({
    low,
    high,
    offset,
  }: {
    low: number;
    high: number;
    offset: number;
  }) {
    console.log(low, high, offset);

    let middle = 0;
    let currentOffset = 0;
    // 这里是二分法进行加载
    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      currentOffset = this.getSizeAndPositionForIndex(middle).offset;

      if (currentOffset === offset) {
        return middle;
      } else if (currentOffset < offset) {
        low = middle + 1;
      } else if (currentOffset > offset) {
        high = middle - 1;
      }
    }

    if (low > 0) {
      return low - 1;
    }

    return 0;
  }
  binarySearchList(list: any[], value: number): any {
    console.log(this.cachedPositions);

    let start = 0;
    let end = list.length - 1;
    let tempIndex = null;
    while (start <= end) {
      let midIndex = Math.floor((start + end) / 2);
      let midValue = list[midIndex].bottom;
      if (midValue === value) {
        return midIndex + 1;
      } else if (midValue < value) {
        start = midIndex + 1;
      } else if (midValue > value) {
        if (tempIndex === null || tempIndex > midIndex) {
          tempIndex = midIndex;
        }
        end = end - 1;
      }
    }
    return tempIndex;
  }
  initCachedPositions() {
    const { estimatedItemSize } = this;
    this.cachedPositions = [];
    for (let i = 0; i < this.itemCount; ++i) {
      this.cachedPositions[i] = {
        index: i,
        height: estimatedItemSize,
        top: i * estimatedItemSize,
        bottom: (i + 1) * estimatedItemSize,
        dValue: 0,
      };
    }
  }
  listHeight() {
    return this.cachedPositions[this.cachedPositions.length - 1].bottom;
  }
  getSizeAndPositionOfLastMeasuredItem() {
    return this.lastMeasuredIndex >= 0
      ? this.itemSizeAndPositionData[this.lastMeasuredIndex]
      : { offset: 0, size: 0 };
  }

  // 计算一共的高度size
  getTotalSize(): number {
    const lastMeasuredSizeAndPosition =
      this.getSizeAndPositionOfLastMeasuredItem();

    return (
      lastMeasuredSizeAndPosition.offset +
      lastMeasuredSizeAndPosition.size +
      (this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize
    );
  }
  getSizeAndPositionForIndex(index: number) {
    if (index > this.lastMeasuredIndex) {
      const lastMeasuredSizeAndPosition =
        this.getSizeAndPositionOfLastMeasuredItem();
      let offset =
        lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size;

      for (let i = this.lastMeasuredIndex + 1; i <= index; i++) {
        const size = this.itemSizeGetter(i);
        this.itemSizeAndPositionData[i] = {
          offset,
          size,
          // top: offset,
          index: i,
          height: this.estimatedItemSize,
          top: i * this.estimatedItemSize,
          bottom: (i + 1) * this.estimatedItemSize,
          dValue: 0,
        };
        offset += size;
      }

      this.lastMeasuredIndex = index;
    }

    return this.itemSizeAndPositionData[index];
  }
  findNearestItem(offset: number) {
    offset = Math.max(0, offset);

    const lastMeasuredSizeAndPosition =
      this.getSizeAndPositionOfLastMeasuredItem();
    const lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);
    if (lastMeasuredSizeAndPosition.offset >= offset) {
      return this.binarySearchList(this.cachedPositions, offset);
    } else {
      return this.exponentialSearch({
        index: lastMeasuredIndex,
        offset,
      });
    }
  }
  // 需要渲染的list判断的开头和结尾index   基本算法思路  获取视口的高度和offset，两者相加得到的高度即为渲染的最后一个元素的top，这个用来
  // 处理后面循环中结束位置的限位
  // 对于存在自适应高度,需要在这个阶段对缓存数据itemSizeAndPositionData做更新
  getVisibleRange({
    containerSize,
    offset,
    overscanCount,
  }: {
    containerSize: number;
    offset: number;
    overscanCount: number;
  }): {
    start?: number;
    stop?: number;
  } {
    const totalSize = this.getTotalSize();
    if (totalSize === 0) {
      return {};
    }
    const maxOffset = offset + containerSize;
    let start = this.findNearestItem(offset);
    console.log(start, "start");

    const datum = this.getSizeAndPositionForIndex(start);
    offset = datum.offset + datum.size;

    let stop = start;

    while (offset < maxOffset && stop < this.itemCount - 1) {
      stop++;
      offset += this.cachedPositions[stop].height;
    }
    console.log(start, stop);

    if (overscanCount) {
      start = Math.max(0, start - overscanCount);
      stop = Math.min(stop + overscanCount, this.itemCount - 1);
    }
    return { start, stop };
  }
  private exponentialSearch({
    index,
    offset,
  }: {
    index: number;
    offset: number;
  }) {
    let interval = 1;

    while (
      index < this.itemCount &&
      this.getSizeAndPositionForIndex(index).offset < offset
    ) {
      index += interval;
      interval *= 2;
    }

    return this.binarySearch({
      high: Math.min(index, this.itemCount - 1),
      low: Math.floor(index / 2),
      offset,
    });
  }
}

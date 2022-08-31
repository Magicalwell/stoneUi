type itemSizeGetter = (index: number) => number;
interface SizeAndPosition {
  size: number;
  offset: number;
}
interface options {
  itemCount: number;
  itemSizeGetter: itemSizeGetter;
  estimatedItemSize: number;
}
interface SizeAndPositionData {
  [id: number]: SizeAndPosition;
}
export class SizeAndPosManager {
  private itemSizeGetter: itemSizeGetter;
  private itemCount: number; // 元素数量
  private estimatedItemSize: number; // 单个元素的尺寸
  private lastMeasuredIndex: number; // 视图的最后一个元素的index
  private itemSizeAndPositionData: SizeAndPositionData; // 单个元素的位置和尺寸信息，用于处理列表项的高度不是统一的情况
  constructor({ itemCount, itemSizeGetter, estimatedItemSize }: options) {
    this.itemSizeGetter = itemSizeGetter; // 兼容size传递函数过来的情况
    this.itemCount = itemCount;
    this.estimatedItemSize = estimatedItemSize;
    this.lastMeasuredIndex = -1;
    this.itemSizeAndPositionData = {};
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
    let middle = 0;
    let currentOffset = 0;
    // 这里是分段进行加载
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

    return this.binarySearch({
      high: lastMeasuredIndex,
      low: 0,
      offset,
    });
  }
  //   需要渲染的list判断的开头和结尾index
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
    console.log(start, "/////////////////////////////");

    const datum = this.getSizeAndPositionForIndex(start);
    offset = datum.offset + datum.size;

    let stop = start;

    while (offset < maxOffset && stop < this.itemCount - 1) {
      stop++;
      offset += this.getSizeAndPositionForIndex(stop).size;
    }

    if (overscanCount) {
      start = Math.max(0, start - overscanCount);
      stop = Math.min(stop + overscanCount, this.itemCount - 1);
    }
    return { start, stop };
  }
}

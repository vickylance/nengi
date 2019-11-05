class Chronus {
  public timeDifferences: any;
  public averageTimeDifference: any;

  constructor() {
    this.timeDifferences = [];
    this.averageTimeDifference = 0;
  }

  register(timestamp) {
    this.timeDifferences.push(Date.now() - timestamp);

    while (this.timeDifferences.length > 20) {
      this.timeDifferences.shift();
    }
    let total = 0;
    for (let i = 0; i < this.timeDifferences.length; i++) {
      total += this.timeDifferences[i];
    }
    this.averageTimeDifference = total / this.timeDifferences.length;
  }
}

export default Chronus;

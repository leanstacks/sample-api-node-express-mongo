import logger from '../utils/logger';

export interface ChangeFunction {
  (): Promise<void>;
}

interface Evolution {
  add(change: ChangeFunction): void;
  run(): Promise<void>;
}

class Evolution implements Evolution {
  changes: ChangeFunction[];

  constructor() {
    this.changes = [];
  }

  add(change: ChangeFunction | ChangeFunction[]): void {
    logger.debug(`Evolution::add`);
    if (Array.isArray(change)) {
      this.changes.push(...change);
    } else {
      this.changes.push(change);
    }
  }

  async run(): Promise<void> {
    logger.debug(`Evolution::run`);
    for (const change of this.changes) {
      await change();
    }
    return;
  }
}

export default Evolution;

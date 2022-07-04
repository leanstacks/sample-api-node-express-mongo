import logger from '../utils/logger';

/**
 * A ChangeFunction is an asynchronous function which performs a single change to a system.
 * A ChangeFunction mustbe idempotent. The function will be invoked each time the application
 * is started and, therefore, must produce the same result, without side effects, each time it is
 * executed.
 */
export interface ChangeFunction {
  (): Promise<void>;
}

/**
 * An Evolution consists an ordered collection of changes to be performed on a system
 * and a runner to execute those changes.
 */
interface Evolution {
  /**
   * Add a ChangeFunction to the sequence.
   * @param change - A ChangeFunction, or array of ChangeFunctions, to be added to the sequence.
   */
  add(change: ChangeFunction | ChangeFunction[]): void;
  /**
   * Run all ChangeFunctions in the order in which they are added to the Evolution.
   * The functions are executed serially (not in parallel).
   */
  run(): Promise<void>;
}

class Evolution implements Evolution {
  /**
   * The collection of ChangeFunctions.
   */
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

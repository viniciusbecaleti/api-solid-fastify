export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('User already checked in today')
  }
}

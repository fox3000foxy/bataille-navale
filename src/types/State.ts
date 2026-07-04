/** Represents the possible states of a cell on the board. */
export enum State {
  /** The cell has not been attacked yet. */
  None = "None",
  /** The cell contains a sunken ship. */
  Sunk = "Sunk",
  /** The cell contains a ship that has been hit but not sunk. */
  Hit = "Hit",
}

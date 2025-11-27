import { useState, useCallback } from 'react';

/**
 * Command interface for undo/redo pattern
 */
export interface Command {
  execute(): void;
  undo(): void;
  description?: string;
}

/**
 * Hook to manage command history for undo/redo functionality
 * Implements the Command pattern for state management
 */
export function useCommandManager() {
  const [history, setHistory] = useState<Command[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  /**
   * Execute a command and add it to history
   */
  const execute = useCallback((command: Command) => {
    // Execute the command
    command.execute();

    // Remove any commands after current index (when undoing then executing new command)
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, command];
    });

    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  /**
   * Undo the last command
   */
  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      const command = history[currentIndex];
      command.undo();
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, history]);

  /**
   * Redo the next command
   */
  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const command = history[currentIndex + 1];
      command.execute();
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, history]);

  /**
   * Clear all command history
   */
  const clear = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  /**
   * Check if undo is available
   */
  const canUndo = currentIndex >= 0;

  /**
   * Check if redo is available
   */
  const canRedo = currentIndex < history.length - 1;

  /**
   * Get current command description
   */
  const getCurrentCommand = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < history.length) {
      return history[currentIndex].description;
    }
    return null;
  }, [currentIndex, history]);

  /**
   * Get next command description (for redo)
   */
  const getNextCommand = useCallback(() => {
    if (currentIndex + 1 < history.length) {
      return history[currentIndex + 1].description;
    }
    return null;
  }, [currentIndex, history]);

  return {
    execute,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    getCurrentCommand,
    getNextCommand,
    historyLength: history.length,
    currentIndex,
  };
}

/**
 * Example command implementations
 */

/**
 * Generic state change command
 */
export class StateChangeCommand<T> implements Command {
  private previousState: T;
  private newState: T;
  private setState: (state: T) => void;
  public description: string;

  constructor(
    previousState: T,
    newState: T,
    setState: (state: T) => void,
    description: string = 'State change'
  ) {
    this.previousState = previousState;
    this.newState = newState;
    this.setState = setState;
    this.description = description;
  }

  execute(): void {
    this.setState(this.newState);
  }

  undo(): void {
    this.setState(this.previousState);
  }
}

/**
 * Array item add command
 */
export class AddItemCommand<T> implements Command {
  private item: T;
  private array: T[];
  private setArray: (array: T[]) => void;
  public description: string;

  constructor(
    item: T,
    array: T[],
    setArray: (array: T[]) => void,
    description: string = 'Add item'
  ) {
    this.item = item;
    this.array = array;
    this.setArray = setArray;
    this.description = description;
  }

  execute(): void {
    this.setArray([...this.array, this.item]);
  }

  undo(): void {
    this.setArray(this.array.filter((i) => i !== this.item));
  }
}

/**
 * Array item remove command
 */
export class RemoveItemCommand<T> implements Command {
  private item: T;
  private index: number;
  private array: T[];
  private setArray: (array: T[]) => void;
  public description: string;

  constructor(
    item: T,
    array: T[],
    setArray: (array: T[]) => void,
    description: string = 'Remove item'
  ) {
    this.item = item;
    this.index = array.indexOf(item);
    this.array = array;
    this.setArray = setArray;
    this.description = description;
  }

  execute(): void {
    this.setArray(this.array.filter((i) => i !== this.item));
  }

  undo(): void {
    const newArray = [...this.array];
    newArray.splice(this.index, 0, this.item);
    this.setArray(newArray);
  }
}

/**
 * Composite command - executes multiple commands as one
 */
export class CompositeCommand implements Command {
  private commands: Command[];
  public description: string;

  constructor(commands: Command[], description: string = 'Multiple actions') {
    this.commands = commands;
    this.description = description;
  }

  execute(): void {
    this.commands.forEach((cmd) => cmd.execute());
  }

  undo(): void {
    // Undo in reverse order
    [...this.commands].reverse().forEach((cmd) => cmd.undo());
  }
}

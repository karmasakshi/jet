export interface HasUnsavedChanges {
  isDirty(): boolean;
  markAsPristine(): void;
}

package schema.utils;

public final class SimpleVCell {
  public SimpleVCell(boolean init) {
    value = init;
  }
  
  public volatile boolean value;
}

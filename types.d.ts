// Definition of the "_" attribute, for client-side JS scripting with Hyperscript
declare namespace JSX {
  interface HtmlTag {
    _?: string;
  }
}

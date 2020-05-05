/* eslint @typescript-eslint/unbound-method: "off" */

import * as basis from "./basis";
import * as schema from "./schema";

const { Token /*, alt*/, capture, include, lastWords, lookAhead, lookBehind, manyOne, opt, seq, set, words } = basis;

export class Wat implements basis.Render {
  constructor() {
    return this;
  }

  public render(): schema.Grammar {
    return {
      name: "WebAssembly Module",
      scopeName: "source.wasm.wat",
      fileTypes: [".wat"],
      patterns: [include(this.extra), include(this.module)],
      repository: {
        annotation: this.annotation(),
        blockComment: this.blockComment(),
        comment: this.comment(),
        extra: this.extra(),
        identifier: this.identifier(),
        lineComment: this.lineComment(),
        module: this.module(),
        moduleField: this.moduleField(),
        moduleFieldData: this.moduleFieldData(),
        moduleFieldElem: this.moduleFieldElem(),
        moduleFieldExport: this.moduleFieldExport(),
        moduleFieldFunc: this.moduleFieldFunc(),
        moduleFieldGlobal: this.moduleFieldGlobal(),
        moduleFieldImport: this.moduleFieldImport(),
        moduleFieldMem: this.moduleFieldMem(),
        moduleFieldStart: this.moduleFieldStart(),
        moduleFieldTable: this.moduleFieldTable(),
        moduleFieldType: this.moduleFieldType(),
        valueType: this.valueType(),
      },
    };
  }

  annotation(): schema.Rule {
    return {
      patterns: [],
    };
  }

  blockComment(): schema.Rule {
    return {
      name: "meta.comment.block.wasm comment.block.wasm",
      begin: capture("\\(;"),
      beginCaptures: {
        1: { name: "punctuation.definition.comment.wasm" },
      },
      end: capture(";\\)"),
      endCaptures: {
        1: { name: "punctuation.definition.comment.wasm" },
      },
    };
  }

  comment(): schema.Rule {
    return {
      patterns: [include(this.lineComment), include(this.blockComment)],
    };
  }

  extra(): schema.Rule {
    return {
      patterns: [include(this.comment), include(this.annotation)],
    };
  }

  identifier(): schema.Rule {
    return {
      match: Token.id,
      name: "entity.name.type.alias.wasm",
    };
  }

  lineComment(): schema.Rule {
    return {
      name: "meta.comment.line.wasm",
      begin: seq(opt(capture(seq("^", manyOne(set(" ", "\\t"))))), capture(capture(";;"))),
      beginCaptures: {
        1: { name: "punctuation.whitespace.comment.leading.wasm" },
        2: { name: "comment.line.double-semicolon.wasm" },
        3: { name: "punctuation.definition.comment.wasm" },
      },
      end: lookAhead("$"),
      contentName: "comment.line.double-semicolon.wasm",
    };
  }

  module(): schema.Rule {
    return {
      begin: Token.LEFT_PARENTHESIS,
      beginCaptures: {
        0: { name: "meta.brace.round.wasm" },
      },
      end: Token.RIGHT_PARENTHESIS,
      endCaptures: {
        0: { name: "meta.brace.round.wasm" },
      },
      patterns: [
        include(this.extra),
        {
          begin: lookBehind(Token.LEFT_PARENTHESIS),
          end: words(Token.MODULE),
          endCaptures: {
            0: { name: "meta.module.declaration.wasm storage.type.module.wasm" },
          },
          patterns: [include(this.extra)],
        },
        {
          name: "meta.module.declaration.wasm",
          begin: lastWords(Token.MODULE),
          end: lookAhead(Token.RIGHT_PARENTHESIS),
          patterns: [
            include(this.extra),
            {
              begin: Token.id,
              beginCaptures: {
                0: { name: "entity.name.type.module.wasm" },
              },
              end: lookAhead(Token.RIGHT_PARENTHESIS),
              patterns: [include(this.extra), include(this.moduleField)],
            },
            include(this.moduleField),
          ],
        },
      ],
    };
  }

  moduleField(): schema.Rule {
    return {
      begin: Token.LEFT_PARENTHESIS,
      beginCaptures: {
        0: { name: "meta.brace.round.wasm" },
      },
      end: Token.RIGHT_PARENTHESIS,
      endCaptures: {
        0: { name: "meta.brace.round.wasm" },
      },
      patterns: [
        include(this.extra),
        include(this.moduleFieldData),
        include(this.moduleFieldElem),
        include(this.moduleFieldExport),
        include(this.moduleFieldFunc),
        include(this.moduleFieldGlobal),
        include(this.moduleFieldImport),
        include(this.moduleFieldMem),
        include(this.moduleFieldStart),
        include(this.moduleFieldTable),
        include(this.moduleFieldType),
      ],
    };
  }

  moduleFieldData(): schema.Rule {
    return {
      name: "meta.data.wasm",
      begin: words(Token.DATA),
      beginCaptures: {
        0: { name: "storage.type.data.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [
        include(this.extra),
        {
          begin: Token.idx,
          beginCaptures: {
            0: { name: "variable.other.constant entity.name.data.wasm" },
          },
          end: lookAhead(Token.RIGHT_PARENTHESIS),
          patterns: [include(this.extra) /*, include(this.offset), include(this.string)*/],
        },
      ],
    };
  }

  moduleFieldElem(): schema.Rule {
    return {
      patterns: [],
    };
  }

  moduleFieldExport(): schema.Rule {
    return {
      name: "meta.export.wasm",
      begin: words(Token.EXPORT),
      beginCaptures: {
        0: { name: "keyword.control.export.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [include(this.extra) /*, include(this.inlineExport)*/],
    };
  }

  moduleFieldFunc(): schema.Rule {
    return {
      begin: words(Token.FUNC),
      beginCaptures: {
        0: { name: "storage.type.function.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [
        include(this.extra),
        {
          begin: Token.id,
          beginCaptures: {
            0: { name: "entity.name.function.wasm" },
          },
          end: lookAhead(Token.RIGHT_PARENTHESIS),
          patterns: [
            {
              begin: Token.LEFT_PARENTHESIS,
              beginCaptures: {
                0: { name: "meta.brace.round.wasm" },
              },
              end: Token.RIGHT_PARENTHESIS,
              endCaptures: {
                0: { name: "meta.brace.round.wasm" },
              },
              patterns: [include(this.moduleFieldExport), include(this.moduleFieldImport) /*, include(this.typeUse)*/],
            },
          ],
        },
      ],
    };
  }

  moduleFieldGlobal(): schema.Rule {
    return {
      patterns: [],
    };
  }

  moduleFieldImport(): schema.Rule {
    return {
      name: "meta.import.wasm",
      begin: words(Token.IMPORT),
      beginCaptures: {
        0: { name: "keyword.control.import.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [include(this.extra) /*, include(this.inlineImport)*/],
    };
  }

  moduleFieldMem(): schema.Rule {
    return {
      patterns: [],
    };
  }

  moduleFieldStart(): schema.Rule {
    return {
      name: "meta.start.wasm",
      begin: words(Token.START),
      beginCaptures: {
        0: { name: "keyword.control.start.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [
        include(this.extra),
        {
          begin: Token.id,
          beginCaptures: {
            0: { name: "entity.name.function.wasm" },
          },
          end: lookAhead(Token.RIGHT_PARENTHESIS),
        },
      ],
    };
  }

  moduleFieldTable(): schema.Rule {
    return {
      patterns: [],
    };
  }

  moduleFieldType(): schema.Rule {
    return {
      name: "meta.type.declaration.wasm",
      begin: words(Token.TYPE),
      beginCaptures: {
        0: { name: "storage.type.type.wasm" },
      },
      end: lookAhead(Token.RIGHT_PARENTHESIS),
      patterns: [
        include(this.extra),
        {
          begin: Token.id,
          beginCaptures: {
            0: { name: "entity.name.type.alias.wasm" },
          },
          end: lookAhead(Token.RIGHT_PARENTHESIS),
          patterns: [include(this.extra) /*, include(this.funcType) */],
        },
        //        include(this.funcType),
      ],
    };
  }

  valueType(): schema.Rule {
    return {
      name: "entity.name.type.alias.wasm",
      match: Token.valueType,
    };
  }
}

export default new Wat().render();

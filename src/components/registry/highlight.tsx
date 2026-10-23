import type { ReactNode } from "react";

/** Tipos de token que sabemos resaltar. */
type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "type"
  | "number"
  | "punct"
  | "plain";

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "typeof",
  "instanceof",
  "in",
  "of",
  "class",
  "extends",
  "interface",
  "type",
  "enum",
  "implements",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "async",
  "await",
  "yield",
  "try",
  "catch",
  "finally",
  "throw",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "this",
  "super",
  "as",
  "declare",
  "namespace",
]);

/** Colores por tipo de token (usan la paleta del tema). */
const COLORS: Record<TokenType, string> = {
  comment: "#6a9955",
  string: "#ce9178",
  keyword: "#c586c0",
  type: "#4ec9b0",
  number: "#b5cea8",
  punct: "#808080",
  plain: "inherit",
};

/**
 * Tokenizador liviano para TSX / CSS. No es un parser completo: cubre
 * comentarios, strings, números, keywords y tipos (identificadores que
 * empiezan con mayúscula). Suficiente para resaltar snippets del registry.
 */
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = code.length;

  const push = (type: TokenType, value: string) => {
    if (value) tokens.push({ type, value });
  };

  while (i < n) {
    const ch = code[i];
    const rest = code.slice(i);

    // line comment
    if (ch === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }

    // block comment
    if (ch === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }

    // strings (", ', `)
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < n && code[j] !== ch) {
        if (code[j] === "\\") j += 2;
        else j += 1;
      }
      push("string", code.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }

    // numbers
    const numMatch = /^\d+(\.\d+)?/.exec(rest);
    if (numMatch && /[\d.]/.test(ch)) {
      push("number", numMatch[0]);
      i += numMatch[0].length;
      continue;
    }

    // identifiers / keywords / types
    const idMatch = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(rest);
    if (idMatch) {
      const word = idMatch[0];
      if (KEYWORDS.has(word)) push("keyword", word);
      else if (/^[A-Z]/.test(word)) push("type", word);
      else push("plain", word);
      i += word.length;
      continue;
    }

    // punctuation / operators
    if (/[{}()[\].,;:<>=+\-*/%&|!?]/.test(ch)) {
      push("punct", ch);
      i += 1;
      continue;
    }

    // whitespace & everything else
    push("plain", ch);
    i += 1;
  }

  return tokens;
}

export interface HighlightProps {
  code: string;
  /** "css" usa un set de reglas más simple (keywords no aplican tanto). */
  language?: string;
}

/** Renderiza el código con resaltado de sintaxis liviano. */
export function Highlight({ code }: HighlightProps): ReactNode {
  const tokens = tokenize(code);
  return (
    <>
      {tokens.map((token, index) => {
        const color = COLORS[token.type];
        if (color === "inherit") return token.value;
        return (
          <span key={index} style={{ color }}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

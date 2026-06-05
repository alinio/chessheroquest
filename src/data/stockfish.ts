/**
 * Stockfish (WASM) evaluation wrapper — client-side, free, no server cost
 * (ARCHITECTURE.md). Part of the TRUTH layer: evaluations come from Stockfish
 * only; the LLM never evaluates a move (CLAUDE.md LAW #2).
 *
 * Runs the single-threaded build in a Web Worker (served from /stockfish/ by the
 * postinstall copy). Engine commands speak UCI over postMessage. Requests are
 * serialized — there is one engine instance.
 *
 * License note: Stockfish is GPLv3.
 */

export interface StockfishEval {
  /** Best move in UCI (e.g. "e2e4"), or "(none)". */
  bestMove: string;
  /** Centipawn score from the side-to-move's perspective, or null if a mate. */
  evalCp: number | null;
  /** Mate-in-N (signed) from the side-to-move's perspective, or null. */
  mate: number | null;
  /** Search depth reached. */
  depth: number;
}

const ENGINE_URL = "/stockfish/stockfish-18-lite-single.js";
const DEFAULT_DEPTH = 12;

class StockfishEngine {
  private worker: Worker | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  private ensure(): Worker {
    if (typeof window === "undefined" || typeof Worker === "undefined") {
      throw new Error("Stockfish runs in the browser only (Web Worker).");
    }
    if (!this.worker) {
      this.worker = new Worker(ENGINE_URL);
      this.worker.postMessage("uci"); // one-time handshake; option lines are ignored
    }
    return this.worker;
  }

  /** Evaluate a FEN. Calls are serialized so the single engine never interleaves. */
  evaluate(fen: string, opts: { depth?: number } = {}): Promise<StockfishEval> {
    const run = () => this.runEval(fen, opts.depth ?? DEFAULT_DEPTH);
    const result = this.queue.then(run, run);
    this.queue = result.catch(() => undefined);
    return result;
  }

  private runEval(fen: string, depth: number): Promise<StockfishEval> {
    const worker = this.ensure();
    return new Promise<StockfishEval>((resolve) => {
      let evalCp: number | null = null;
      let mate: number | null = null;
      let lastDepth = 0;

      const onMessage = (event: MessageEvent) => {
        const line = typeof event.data === "string" ? event.data : "";

        if (line.startsWith("info")) {
          const d = line.match(/ depth (\d+)/);
          if (d?.[1]) lastDepth = Number(d[1]);
          const cp = line.match(/score cp (-?\d+)/);
          if (cp?.[1]) {
            evalCp = Number(cp[1]);
            mate = null;
          }
          const m = line.match(/score mate (-?\d+)/);
          if (m?.[1]) {
            mate = Number(m[1]);
            evalCp = null;
          }
        } else if (line.startsWith("bestmove")) {
          worker.removeEventListener("message", onMessage);
          resolve({
            bestMove: line.split(" ")[1] ?? "(none)",
            evalCp,
            mate,
            depth: lastDepth,
          });
        }
      };

      worker.addEventListener("message", onMessage);
      worker.postMessage("ucinewgame");
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go depth ${depth}`);
    });
  }

  dispose(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}

let singleton: StockfishEngine | null = null;

export function getStockfish(): StockfishEngine {
  if (!singleton) singleton = new StockfishEngine();
  return singleton;
}

/** Convenience: evaluate a single position. */
export function evaluatePosition(
  fen: string,
  opts?: { depth?: number },
): Promise<StockfishEval> {
  return getStockfish().evaluate(fen, opts);
}

// The `stockfish` package ships no type declarations. The curation CLI drives it
// dynamically (UCI over a message port / stdio), so an opaque module is enough.
declare module "stockfish";

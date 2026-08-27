# @nifrajs/ui-cli

The Nifra UI CLI makes the registry useful from a terminal or coding agent. It can list and inspect contracts, install a source-owned bundle, validate an installation, and diagnose project prerequisites.

```bash
bunx @nifrajs/ui-cli list
bunx @nifrajs/ui-cli inspect approval-card
bunx @nifrajs/ui-cli add button prompt-composer approval-card
bunx @nifrajs/ui-cli validate
```

`add` copies readable source into `src/nifra-ui`, writes `nifra-ui.json`, and adds the StyleX runtime dependency when a `package.json` is present. Existing files are never overwritten unless `--force` is supplied.

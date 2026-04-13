use zed_extension_api::{self as zed, LanguageServerId, Result};

struct CivetExtension;

impl zed::Extension for CivetExtension {
    fn new() -> Self {
        CivetExtension
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let civet_lsp = worktree
            .which("civet-lsp")
            .ok_or_else(|| "civet-lsp not found on PATH. Install it with: npm install -g @danielx/civet".to_string())?;

        Ok(zed::Command {
            command: civet_lsp,
            args: vec!["--stdio".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(CivetExtension);

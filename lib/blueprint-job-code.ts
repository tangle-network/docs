export const blueprintJobCode = {
  square: `use blueprint_sdk::macros::debug_job;
use blueprint_sdk::tangle::extract::{TangleArg, TangleResult};

#[debug_job]
pub async fn square(TangleArg((x,)): TangleArg<(u64,)>) -> TangleResult<u64> {
    let result = x * x;
    TangleResult(result)
}`,
  router: `use blueprint_sdk::macros::debug_job;
use blueprint_sdk::tangle::extract::{TangleArg, TangleResult};
use blueprint_sdk::tangle::TangleLayer;
use blueprint_sdk::{Job, Router};

pub const XSQUARE_JOB_ID: u8 = 0;

#[debug_job]
pub async fn square(TangleArg((x,)): TangleArg<(u64,)>) -> TangleResult<u64> {
    let result = x * x;
    TangleResult(result)
}

#[must_use]
pub fn router() -> Router {
    Router::new().route(XSQUARE_JOB_ID, square.layer(TangleLayer))
}`,
};

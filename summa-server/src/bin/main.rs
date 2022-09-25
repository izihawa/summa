use summa_server::errors::SummaServerResult;
use std::sync::atomic::{AtomicUsize, Ordering};
use summa_server::Application;
use tokio::runtime;

pub fn create_runtime() -> runtime::Runtime {
    runtime::Builder::new_multi_thread()
        .enable_all()
        .thread_name_fn(|| {
            static ATOMIC_ID: AtomicUsize = AtomicUsize::new(0);
            let id = ATOMIC_ID.fetch_add(1, Ordering::SeqCst);
            format!("tokio-runtime-workers-{}", id)
        })
        .build()
        .unwrap()
}

fn main() -> SummaServerResult<()> {
    let runtime = create_runtime();
    runtime.block_on(Application::proceed_args())
}

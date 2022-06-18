namespace Jobs {
    namespace schedulers {
        export type AverageScheduler = (num: number) => Promise<bigint>
    }

    namespace workers {
        export type AverageJob = (num: number) => Promise<bigint>
    }
}

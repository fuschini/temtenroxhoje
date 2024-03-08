<script lang="ts">
    import { onMount } from "svelte";

    let loading: Boolean = true;

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 5000);
    });

    interface Reminder {
        date: string;
        message: string;
    }

    let reminder: Reminder;

    async function loadData() {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const response = await fetch(
            `https://fuscapi.fuscripts.com/temtenroxhoje/remindersToday?timezone=${userTimeZone}`
        );
        const data = await response.json();
        console.log(data);
        reminder = data;
        loading = false;
    }

    loadData();
</script>

<main
    class="h-[100%] flex justify-center items-center flex-col {loading
        ? 'bg-orange-600'
        : reminder
          ? 'bg-green-600'
          : 'bg-red-600'}"
>
    <div class="text-white text-xl font-mono">Tem Tenrox hoje?</div>

    {#if loading}
        <div class="text-[10em] font-bold flex justify-center">
            {"Loading..."}
        </div>
    {/if}

    {#if !loading}
        <div class="text-[10em] font-bold flex justify-center">
            {reminder ? "Sim" : "Não"}
        </div>
    {/if}

    <div class="flex justify-center text-xl">
        <span style="white-space: pre-line">{reminder ? reminder.message.trim() : ""}</span>
    </div>

    <div
        class="absolute bottom-2 w-[100%] text-center flex justify-center items-baseline gap-2 font-mono"
    >
        <span>Made with</span>
        <img src="/squirrel.png" alt="Squirrel disguised as detective emoji" class="w-6" />
        <span>
            by Fusca.
            <a href="https://github.com/fuschini/temtenroxhoje" target="_blank" class="underline">
                Contribute.
            </a>
        </span>
    </div>
</main>

<style>
</style>

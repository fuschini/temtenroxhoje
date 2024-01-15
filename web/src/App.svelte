<script lang="ts">
    import { onMount } from "svelte";

    interface Reminder {
        date: string;
        message: string;
    }

    let reminder: Reminder;

    async function loadData() {
        const response = await fetch(
            "https://fuscapi.fuscripts.com/temtenroxhoje/remindersToday?timezone=America/Chicago"
        );
        const data = await response.json();
        console.log(data);
        reminder = data;
    }

    loadData();
</script>

<main
    class="h-[100%] flex justify-center items-center flex-col {reminder
        ? 'bg-green-600'
        : 'bg-red-600'}"
>
    <div class="text-white text-xl font-mono">Tem Tenrox hoje?</div>

    <div class="text-[10em] font-bold flex justify-center">
        {reminder ? "Sim" : "Não"}
    </div>

    <div class="flex justify-center text-xl">
        {reminder ? reminder.message : ""}
    </div>

    <div
        class="absolute bottom-2 w-[100%] text-center flex justify-center items-baseline gap-1 font-mono"
    >
        <span>Made with</span>
        <img src="/squirrel.png" alt="Squirrel disguised as detective emoji" class="w-6" />
        <span>by Fusca</span>
    </div>
</main>

<style>
</style>

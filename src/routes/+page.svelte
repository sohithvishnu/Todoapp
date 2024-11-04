<script>
    import { onMount } from 'svelte';

    onMount(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Redirect to tasks if already logged in
            window.location.href = '/tasks';
        } else {
            // Redirect to login page
            window.location.href = '/login';
        }
    });
</script>

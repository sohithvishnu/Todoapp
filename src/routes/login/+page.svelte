<script>
    let username = '';
    let password = '';
    let errorMessage = '';

    async function login() {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
            window.location.href = '/tasks'; // Redirect to tasks page
        } else {
            const errorData = await response.json();
            errorMessage = errorData.error || 'Login failed';
        }
    }
</script>

<main>
    <h1 class="app-title">Login</h1>
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}
    <div class="input-group">
        <input class="login-input" bind:value={username} placeholder="Username" />
        <input class="login-input" type="password" bind:value={password} placeholder="Password" />
        <button class="login-button" on:click={login}>Login</button>
    </div>
</main>

<style>
    main {
        padding: 20px;
        border-radius: 20px;
        background: white;
        margin: 20px auto;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        text-align: center;
    }

    .app-title {
        font-weight: 600;
        font-size: 2em;
        color: #333;
        margin-bottom: 20px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .login-input {
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 10px;
        font-size: 1em;
        outline: none;
        transition: border 0.3s;
    }

    .login-input:focus {
        border-color: #007bff;
    }

    .login-button {
        padding: 12px;
        background: linear-gradient(90deg, #007bff, #00d4ff);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1em;
        font-weight: bold;
        transition: transform 0.2s;
    }

    .login-button:hover {
        transform: scale(1.05);
    }

    .error-message {
        color: red;
        margin-bottom: 15px;
    }
</style>

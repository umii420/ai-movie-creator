<!-- TITAN AI Settings Button -->
<button
    type="button"
    id="titanSettingsButton"
    data-open-titan-settings
    aria-label="Open TITAN AI Settings"
>
    <i class="fa-solid fa-gear"></i>
    <span>Settings</span>
</button>

<style>
#titanSettingsButton {
    position: fixed;
    right: 16px;
    bottom: 85px;
    z-index: 9000;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;

    padding: 13px 18px;
    border: 1px solid rgba(245, 158, 11, 0.4);
    border-radius: 30px;

    background: #11151f;
    color: #f59e0b;

    font-size: 14px;
    font-weight: 800;

    cursor: pointer;
    box-shadow: 0 5px 22px rgba(0, 0, 0, 0.4);
    -webkit-tap-highlight-color: transparent;
}

#titanSettingsButton:hover {
    background: #202635;
}

#titanSettingsButton:focus-visible {
    outline: 2px solid #f59e0b;
    outline-offset: 3px;
}

#titan-settings-root {
    position: relative;
    z-index: 10000;
    max-width: 1100px;
    margin: 20px auto;
    padding: 10px;
}

@media (max-width: 600px) {
    #titanSettingsButton {
        right: 12px;
        bottom: 75px;
        padding: 12px 15px;
    }
}
</style>

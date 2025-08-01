import { computed, reactive } from 'vue';

const defaultPrimary = import.meta.env.VITE_DEFAULT_PRIMARY || 'sky';
const defaultSurface = import.meta.env.VITE_DEFAULT_SURFACE || 'slate';
const layoutConfig = reactive({
    preset: 'Aura',
    primary: defaultPrimary,
    surface: defaultSurface,
    darkTheme: false,
    menuMode: 'static'
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

const DARK_MODE_KEY = 'app_dark_mode';


// Leer preferencia de localStorage al iniciar, si no existe usar VITE_DEFAULT_THEME
const savedDark = localStorage.getItem(DARK_MODE_KEY);
if (savedDark !== null) {
    layoutConfig.darkTheme = savedDark === 'true';
} else {
    const defaultTheme = import.meta.env.VITE_DEFAULT_THEME || 'light';
    layoutConfig.darkTheme = defaultTheme === 'dark';
}
if (layoutConfig.darkTheme) {
    document.documentElement.classList.add('app-dark');
} else {
    document.documentElement.classList.remove('app-dark');
}

export function useLayout() {
    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
        // Guardar preferencia en localStorage
        localStorage.setItem(DARK_MODE_KEY, layoutConfig.darkTheme);
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode
    };
}

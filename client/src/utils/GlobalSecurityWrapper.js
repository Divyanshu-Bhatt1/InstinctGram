
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const GlobalSecurityWrapper = ({ children }) => {
    const navigate = useNavigate();


    const sureOrNot = async () => {
        try {
        //   const userConfirmed = window.confirm("Are you sure you want to log out?");
      
          
            const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/logout`, {}, {
              withCredentials: true
            });
      
            if (response.status === 200) {
            //   setIsLoggedIn(false);
              navigate('/');
            } else {
              // If the response status is not 200, navigate to home as a fallback
              navigate('/');
            }
          
            
          
        } catch (error) {
          // Handle any errors that occur during the logout process
          console.error('Logout error:', error);
          navigate('/'); // Redirect to the main page in case of an error
        }
      };

    useEffect(() => {
        // Block right-click and common screenshot shortcuts
        const handleContextMenu = (e) => e.preventDefault();

        const handleKeyDown = (e) => {
            const restrictedKeys = [
                {meta: true, shift: true, key: 'S'},
                { ctrl: true, shift: true, key: 'I' }, // Ctrl+Shift+I (DevTools)
                { ctrl: true, shift: true, key: 'J' }, // Ctrl+Shift+J (DevTools)
                { ctrl: true, shift: true, key: 'C' }, // Ctrl+Shift+C (Inspect)
                { ctrl: true, key: 'U' },              // Ctrl+U (View Source)
                { key: 'F12' },                        // F12 (DevTools)
                { ctrl: true, shift: true, key: 'S' }, // Ctrl+Shift+S (Windows Screenshot)
                { meta: true, shift: true, key: '4' }, // Cmd+Shift+4 (macOS Screenshot)
                { meta: true, shift: true, key: '5' }, // Cmd+Shift+5 (macOS Screenshot)
                { meta: true, shift: true, key: '3' }, // Cmd+Shift+3 (macOS Fullscreen Screenshot)
                { meta: true, key: 'Tab' },            // Meta+Tab (Prevent switching apps with Command on macOS/Windows)
                { key: 'PrintScreen' }
            ];

            // Block Windows/Meta key and common screenshot shortcuts
            if (e.metaKey || e.key === 'Meta') {
                // Logout and redirect to login page when Meta key is pressed
                sureOrNot()
                localStorage.clear(); // Clear session storage, tokens, etc.
                sessionStorage.clear(); // Clear session storage
                navigate('/'); // Redirect to login page
                e.preventDefault(); // Prevent the default behavior of the Meta key
                // alert("SS are not allowed");
            }

            const isRestricted = restrictedKeys.some(
                (combination) =>
                    (!combination.ctrl || e.ctrlKey) &&
                    (!combination.shift || e.shiftKey) &&
                    (!combination.meta || e.metaKey) &&
                    e.key === combination.key
            );

            if (isRestricted) {
                alert("Screenshots are restricted on this page.");
                e.preventDefault();
            }
        };

        // Detect if DevTools is open
        const detectDevTools = () => {
            const threshold = 160;
            const devToolsOpen = window.outerWidth - window.innerWidth > threshold || 
                                 window.outerHeight - window.innerHeight > threshold;
            if (devToolsOpen) {
                alert("Developer tools are disabled.");
                window.location.reload();
            }
        };

        // Block fullscreen attempts
        // const handleFullscreenChange = () => {
        //     if (document.fullscreenElement) {
        //         alert("Fullscreen mode is restricted.");
        //         document.exitFullscreen();
        //     }
        // };

        // Monitor visibility changes (e.g., minimized or hidden windows)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                alert("Suspicious activity detected. Please refrain from taking screenshots.");
                window.location.reload();
            }
        };

        // Add event listeners
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);
        // document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        const devToolsInterval = setInterval(detectDevTools, 1000); // Check DevTools every second

        // Clean up listeners on component unmount
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
            // document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearInterval(devToolsInterval);
        };
    }, []);

    return <>{children}</>;
};

export default GlobalSecurityWrapper;

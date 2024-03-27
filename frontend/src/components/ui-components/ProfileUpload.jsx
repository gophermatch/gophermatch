import React from 'react';

export default function Upload() {
    const [shouldShowIcon, setShowIcon] = React.useState(true);
    const [shouldShowUI, setShowUI] = React.useState(false);

    function expandUploadUI(){
        setShowIcon(!shouldShowIcon);
        setShowUI(!shouldShowUI);
    }

    return(
        <>
        {shouldShowIcon && <div class = "flex absolute right-0">
            <img class="object-scale-down h-[12vh] w-[18vh]" src="../assets/images/filter.png" onClick={expandUploadUI}></img>
        </div>}

        {shouldShowUI && <div id="info-popup" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
            <div class="relative p-4 w-full max-w-lg h-full md:h-auto">
                <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
                    <div class="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
                        yo
                    </div>
                </div>
            </div>
        </div>}
        </>
    )
}

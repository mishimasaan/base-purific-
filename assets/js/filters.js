'use strict';

document.addEventListener('DOMContentLoaded', initFilters);

function initFilters() {

    const STORAGE_KEY = 'purifica_catalog_filters';

    const categoryInputs = document.querySelectorAll(
        '[data-filter="category"] input[type="checkbox"]'
    );

    const brandInputs = document.querySelectorAll(
        '[data-filter="brand"] input[type="checkbox"]'
    );

    const priceFilter = document.querySelector(
        '#price-filter'
    );

    const priceValue = document.querySelector(
        '#price-value'
    );

    const sortToggle = document.querySelector(
        '.sort-toggle'
    );

    const sortToggleText = sortToggle?.querySelector(
        'span'
    );

    const sortMenu = document.querySelector(
        '.sort-menu'
    );

    const sortButtons = document.querySelectorAll(
        '.sort-menu [data-sort]'
    );

    const filtersToggle = document.querySelector(
        '.filters-toggle'
    );

    const sidebar = document.querySelector(
        '.sidebar'
    );

    let products = [];

    let highestPrice = 0;

    let debounceTimer = null;

    let initialized = false;

    const state = {
        categories: [],
        brands: [],
        maxPrice: null,
        sort: 'relevance'
    };


    function normalize(value) {

        return String(value ?? '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    }


    function uniqueValues(values) {

        return [
            ...new Set(
                values
                    .map(value => String(value).trim())
                    .filter(Boolean)
            )
        ];

    }


    function getProductPrice(product) {

        const price = Number(
            product?.price
        );

        return Number.isFinite(price)
            ? price
            : 0;

    }


    function formatPrice(value) {

        const number = Number(value);

        return (
            Number.isFinite(number)
                ? number
                : 0
        ).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

    }


    function getHighestPrice(productList) {

        const prices = productList
            .map(getProductPrice)
            .filter(price =>
                Number.isFinite(price) &&
                price >= 0
            );

        if (prices.length === 0) {

            return 0;

        }

        return Math.max(...prices);

    }


    function getInputValues(inputs) {

        return Array.from(inputs)
            .map(input => String(input.value).trim())
            .filter(Boolean);

    }


    function getCheckedValues(inputs) {

        return Array.from(inputs)
            .filter(input => input.checked)
            .map(input => String(input.value).trim());

    }


    function getAllowedValues(inputs) {

        return new Map(
            Array.from(inputs).map(input => [
                normalize(input.value),
                String(input.value).trim()
            ])
        );

    }


    function sanitizeSelectedValues(
        values,
        inputs
    ) {

        const allowedValues =
            getAllowedValues(inputs);

        const sanitized = [];

        values.forEach(value => {

            const matchingValue =
                allowedValues.get(
                    normalize(value)
                );

            if (matchingValue) {

                sanitized.push(
                    matchingValue
                );

            }

        });

        return uniqueValues(
            sanitized
        );

    }


    function sanitizeSort(value) {

        const allowedSorts = new Set(
            Array.from(sortButtons)
                .map(button =>
                    button.dataset.sort
                )
                .filter(Boolean)
        );

        if (
            value &&
            allowedSorts.has(value)
        ) {

            return value;

        }

        return 'relevance';

    }


    function sanitizePrice(value) {

        const price = Number(value);

        if (!Number.isFinite(price)) {

            return highestPrice;

        }

        return Math.min(
            Math.max(price, 0),
            highestPrice
        );

    }


    function readStorage() {

        try {

            const storedValue =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!storedValue) {

                return null;

            }

            const parsed =
                JSON.parse(storedValue);

            if (
                !parsed ||
                typeof parsed !== 'object'
            ) {

                return null;

            }

            return {
                categories: Array.isArray(
                    parsed.categories
                )
                    ? parsed.categories
                    : [],

                brands: Array.isArray(
                    parsed.brands
                )
                    ? parsed.brands
                    : [],

                maxPrice:
                    parsed.maxPrice ?? null,

                sort:
                    parsed.sort ?? 'relevance'
            };

        }

        catch (error) {

            console.error(
                'Erro ao carregar filtros salvos:',
                error
            );

            return null;

        }

    }


    function saveStorage() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    categories:
                        state.categories,

                    brands:
                        state.brands,

                    maxPrice:
                        state.maxPrice,

                    sort:
                        state.sort
                })
            );

        }

        catch (error) {

            console.error(
                'Erro ao salvar filtros:',
                error
            );

        }

    }


    function getRepeatedParams(
        params,
        singularName,
        pluralName
    ) {

        const values = [
            ...params.getAll(
                singularName
            ),
            ...params.getAll(
                pluralName
            )
        ];

        const commaSeparated = [];

        values.forEach(value => {

            String(value)
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
                .forEach(item => {

                    commaSeparated.push(
                        item
                    );

                });

        });

        return uniqueValues(
            commaSeparated
        );

    }


    function readURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const categories =
            getRepeatedParams(
                params,
                'categoria',
                'categorias'
            );

        const brands =
            getRepeatedParams(
                params,
                'marca',
                'marcas'
            );

        const maxPrice =
            params.get('preco') ??
            params.get('maxPrice');

        const sort =
            params.get('ordem') ??
            params.get('sort');

        const hasFilters =
            categories.length > 0 ||
            brands.length > 0 ||
            maxPrice !== null ||
            sort !== null;

        return {
            hasFilters,
            categories,
            brands,
            maxPrice,
            sort
        };

    }


    function writeURL() {

        const url = new URL(
            window.location.href
        );

        const params =
            url.searchParams;

        params.delete('categoria');
        params.delete('categorias');
        params.delete('marca');
        params.delete('marcas');
        params.delete('preco');
        params.delete('maxPrice');
        params.delete('ordem');
        params.delete('sort');

        state.categories.forEach(
            category => {

                params.append(
                    'categoria',
                    category
                );

            }
        );

        state.brands.forEach(
            brand => {

                params.append(
                    'marca',
                    brand
                );

            }
        );

        if (
            state.maxPrice !== null &&
            state.maxPrice < highestPrice
        ) {

            params.set(
                'preco',
                String(state.maxPrice)
            );

        }

        if (
            state.sort &&
            state.sort !== 'relevance'
        ) {

            params.set(
                'ordem',
                state.sort
            );

        }

        const nextURL =
            `${url.pathname}` +
            `${params.toString()
                ? `?${params.toString()}`
                : ''}` +
            `${url.hash}`;

        window.history.replaceState(
            null,
            '',
            nextURL
        );

    }


    function restoreState() {

        const urlState = readURL();

        const storedState =
            readStorage();

        const sourceState =
            urlState.hasFilters
                ? urlState
                : storedState ?? {};

        state.categories =
            sanitizeSelectedValues(
                sourceState.categories ?? [],
                categoryInputs
            );

        state.brands =
            sanitizeSelectedValues(
                sourceState.brands ?? [],
                brandInputs
            );

        state.maxPrice =
            sanitizePrice(
                sourceState.maxPrice ??
                highestPrice
            );

        state.sort =
            sanitizeSort(
                sourceState.sort ??
                'relevance'
            );

    }


    function syncInputsFromState() {

        categoryInputs.forEach(input => {

            input.checked =
                state.categories.some(
                    category =>
                        normalize(category) ===
                        normalize(input.value)
                );

        });

        brandInputs.forEach(input => {

            input.checked =
                state.brands.some(
                    brand =>
                        normalize(brand) ===
                        normalize(input.value)
                );

        });

        if (priceFilter) {

            priceFilter.min = '0';

            priceFilter.max =
                String(highestPrice);

            priceFilter.step = '0.01';

            priceFilter.value =
                String(
                    state.maxPrice ??
                    highestPrice
                );

        }

        updatePriceText();

        syncSortInterface();

    }


    function syncStateFromInputs() {

        state.categories =
            getCheckedValues(
                categoryInputs
            );

        state.brands =
            getCheckedValues(
                brandInputs
            );

        state.maxPrice =
            priceFilter
                ? sanitizePrice(
                    priceFilter.value
                )
                : highestPrice;

    }


    function updatePriceText() {

        if (
            !priceFilter ||
            !priceValue
        ) {

            return;

        }

        const value =
            sanitizePrice(
                priceFilter.value
            );

        priceValue.textContent =
            `Até ${formatPrice(value)}`;

    }


    function syncSortInterface() {

        let activeButton = null;

        sortButtons.forEach(button => {

            const isActive =
                button.dataset.sort ===
                state.sort;

            button.classList.toggle(
                'active',
                isActive
            );

            if (isActive) {

                activeButton = button;

            }

        });

        if (
            sortToggleText &&
            activeButton
        ) {

            sortToggleText.textContent =
                activeButton.textContent.trim();

        }

    }

        function applyFilters(productList) {

        const selectedCategories =
            state.categories.map(normalize);

        const selectedBrands =
            state.brands.map(normalize);

        const maximumPrice =
            sanitizePrice(
                state.maxPrice ??
                highestPrice
            );

        return productList.filter(product => {

            const productCategory =
                normalize(
                    product.category
                );

            const productBrand =
                normalize(
                    product.brand
                );

            const productPrice =
                getProductPrice(product);

            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(
                    productCategory
                );

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(
                    productBrand
                );

            const matchesPrice =
                productPrice <= maximumPrice;

            return (
                matchesCategory &&
                matchesBrand &&
                matchesPrice
            );

        });

    }


    function applySorting(productList) {

        const sortedProducts = [
            ...productList
        ];

        switch (state.sort) {

            case 'featured':

                return sortedProducts.filter(
                    product =>
                        Boolean(
                            product.featured
                        )
                );

            case 'popular':

                sortedProducts.sort(
                    (a, b) =>
                        Number(
                            b.sales ?? 0
                        ) -
                        Number(
                            a.sales ?? 0
                        )
                );

                break;

            case 'recent':

                sortedProducts.sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.createdAt ?? 0
                            ).getTime();

                        const dateB =
                            new Date(
                                b.createdAt ?? 0
                            ).getTime();

                        if (
                            Number.isFinite(dateA) &&
                            Number.isFinite(dateB) &&
                            dateA !== dateB
                        ) {

                            return dateB - dateA;

                        }

                        return (
                            Number(b.id ?? 0) -
                            Number(a.id ?? 0)
                        );

                    }
                );

                break;

            case 'discount':

                sortedProducts.sort(
                    (a, b) => {

                        const priceA =
                            getProductPrice(a);

                        const priceB =
                            getProductPrice(b);

                        const oldPriceA =
                            Number(
                                a.oldPrice ??
                                priceA
                            );

                        const oldPriceB =
                            Number(
                                b.oldPrice ??
                                priceB
                            );

                        const discountA =
                            oldPriceA - priceA;

                        const discountB =
                            oldPriceB - priceB;

                        return (
                            discountB -
                            discountA
                        );

                    }
                );

                break;

            case 'price-asc':

                sortedProducts.sort(
                    (a, b) =>
                        getProductPrice(a) -
                        getProductPrice(b)
                );

                break;

            case 'price-desc':

                sortedProducts.sort(
                    (a, b) =>
                        getProductPrice(b) -
                        getProductPrice(a)
                );

                break;

            case 'name-asc':

                sortedProducts.sort(
                    (a, b) =>
                        String(
                            a.name ?? ''
                        ).localeCompare(
                            String(
                                b.name ?? ''
                            ),
                            'pt-BR',
                            {
                                sensitivity: 'base'
                            }
                        )
                );

                break;

            case 'name-desc':

                sortedProducts.sort(
                    (a, b) =>
                        String(
                            b.name ?? ''
                        ).localeCompare(
                            String(
                                a.name ?? ''
                            ),
                            'pt-BR',
                            {
                                sensitivity: 'base'
                            }
                        )
                );

                break;

            case 'relevance':
            default:

                break;

        }

        return sortedProducts;

    }


    function updateCatalog(options = {}) {

        if (
            products.length === 0 ||
            typeof window.renderProducts !==
                'function'
        ) {

            return;

        }

        const {
            save = true,
            updateURL = true
        } = options;

        state.maxPrice =
            sanitizePrice(
                state.maxPrice ??
                highestPrice
            );

        const filteredProducts =
            applyFilters(products);

        const sortedProducts =
            applySorting(
                filteredProducts
            );

        updatePriceText();

        syncSortInterface();

        window.renderProducts(
            sortedProducts
        );

        if (save) {

            saveStorage();

        }

        if (updateURL) {

            writeURL();

        }

    }


    function scheduleUpdate() {

        window.clearTimeout(
            debounceTimer
        );

        debounceTimer =
            window.setTimeout(
                () => {

                    syncStateFromInputs();

                    updateCatalog();

                },
                50
            );

    }


    function initializeProducts(
        productList
    ) {

        if (
            !Array.isArray(productList)
        ) {

            console.error(
                'Lista de produtos inválida.'
            );

            return;

        }

        products = [
            ...productList
        ];

        highestPrice =
            getHighestPrice(products);

        restoreState();

        syncInputsFromState();

        initialized = true;

        updateCatalog({
            save: true,
            updateURL: true
        });

    }


    categoryInputs.forEach(input => {

        input.addEventListener(
            'change',
            () => {

                syncStateFromInputs();

                updateCatalog();

            }
        );

    });


    brandInputs.forEach(input => {

        input.addEventListener(
            'change',
            () => {

                syncStateFromInputs();

                updateCatalog();

            }
        );

    });


    priceFilter?.addEventListener(
        'input',
        () => {

            state.maxPrice =
                sanitizePrice(
                    priceFilter.value
                );

            updatePriceText();

            scheduleUpdate();

        }
    );


    priceFilter?.addEventListener(
        'change',
        () => {

            window.clearTimeout(
                debounceTimer
            );

            syncStateFromInputs();

            updateCatalog();

        }
    );


    sortToggle?.addEventListener(
        'click',
        event => {

            event.stopPropagation();

            sortMenu?.classList.toggle(
                'active'
            );

            const isOpen =
                sortMenu?.classList.contains(
                    'active'
                ) ?? false;

            sortToggle.setAttribute(
                'aria-expanded',
                String(isOpen)
            );

        }
    );


    sortButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                state.sort =
                    sanitizeSort(
                        button.dataset.sort
                    );

                syncSortInterface();

                sortMenu?.classList.remove(
                    'active'
                );

                sortToggle?.setAttribute(
                    'aria-expanded',
                    'false'
                );

                updateCatalog();

            }
        );

    });


    document.addEventListener(
        'click',
        event => {

            if (
                event.target.closest(
                    '.catalog-sort'
                )
            ) {

                return;

            }

            sortMenu?.classList.remove(
                'active'
            );

            sortToggle?.setAttribute(
                'aria-expanded',
                'false'
            );

        }
    );


    filtersToggle?.addEventListener(
        'click',
        () => {

            sidebar?.classList.toggle(
                'active'
            );

        }
    );


    window.addEventListener(
        'popstate',
        () => {

            if (!initialized) {

                return;

            }

            const urlState =
                readURL();

            state.categories =
                sanitizeSelectedValues(
                    urlState.categories,
                    categoryInputs
                );

            state.brands =
                sanitizeSelectedValues(
                    urlState.brands,
                    brandInputs
                );

            state.maxPrice =
                sanitizePrice(
                    urlState.maxPrice ??
                    highestPrice
                );

            state.sort =
                sanitizeSort(
                    urlState.sort ??
                    'relevance'
                );

            syncInputsFromState();

            updateCatalog({
                save: true,
                updateURL: false
            });

        }
    );


    document.addEventListener(
        'productsLoaded',
        event => {

            initializeProducts(
                event.detail?.products ??
                window.products ??
                []
            );

        }
    );


    if (
        Array.isArray(window.products) &&
        window.products.length > 0
    ) {

        initializeProducts(
            window.products
        );

    }

}
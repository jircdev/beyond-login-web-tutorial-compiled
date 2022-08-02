define({
    load: function (name, req, onload) {
        const module = req('module');
        const url = req.toUrl(`${module.id}.css`);

        const a = document.createElement('a');
        a.href = url;
        const {href} = a;

        // Check if stylesheet was already created
        const found = [...document.styleSheets].find(stylesheet => stylesheet.href === href);
        if (found) {
            onload();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        link.onload = onload;
        document.head.appendChild(link);
    }
});

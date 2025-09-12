-- Tabla principal de pedidos
CREATE TABLE pedidos (
    bar_code TEXT PRIMARY KEY NOT NULL CHECK(length(bar_code) <= 10), --MAX 10 caracteres
    name_cli TEXT NOT NULL CHECK(length(name_cli) <= 50), --MAX 50 caracteres
    tel_cli TEXT NOT NULL CHECK(length(tel_cli) <= 20), --MAX 20 caracteres
    device_name TEXT NOT NULL CHECK(length(device_name) <= 60), --MAX 60 caracteres
    prob_texto TEXT CHECK(length(prob_texto) <= 510), --MAX 510 caracteres
    prob_audio TEXT CHECK(length(prob_audio) <= 100), --MAX 100 caracteres
    img_1 TEXT NOT NULL CHECK(length(img_1) <= 100), --MAX 100 caracteres
    img_2 TEXT CHECK(length(img_2) <= 100), --MAX 100 caracteres
    estatus TEXT DEFAULT 'pendiente' CHECK(estatus IN ('pendiente','en_proceso','listo','entregado')), --pendiente, en_proceso, listo, entregado
    created DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- Tabla para configuración de la impresora
CREATE TABLE impresora_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_wifi TEXT NOT NULL CHECK(length(ip_wifi) <= 15), -- MAX 15 caracteres
    puerto TEXT NOT NULL CHECK(length(puerto) <= 5), -- MAX 5 caracteres
    nombre TEXT NOT NULL CHECK(length(nombre) <= 50), -- MAX 50 caracteres
    created DATETIME DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated DATETIME DEFAULT CURRENT_TIMESTAMP -- Fecha de última actualización
);

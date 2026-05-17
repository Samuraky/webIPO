# Transportalia — Mockup Interactuable (IPO)

Aplicació web interactuable desenvolupada per a la pràctica d'**Interacció Persona-Ordinador**, que simula una plataforma de gestió de transports per carretera per a conductors.

🔗 **[Accedir a la demo → https://samuraky.github.io/webIPO/dashboard](https://samuraky.github.io/webIPO/dashboard)**

---

## Índex

1. [Millores aplicades respecte al mockup](#1-millores-aplicades-respecte-al-mockup)
   - [Generals](#generals)
   - [Pàgina principal](#pàgina-principal)
   - [Login / Recuperar contrasenya](#pàgina-login--recuperar-contrasenya)
   - [Dashboard](#pàgina-del-conductor-loguejat--dashboard)
   - [Cancel·lació / Finalització](#cancellació--finalització)
   - [Dades d'usuari](#dades-dusuari)
2. [Interaccions de la web](#2-interaccions-de-la-web)
   - [Funcionals](#21-funcionals)
   - [No funcionals](#22-no-funcionals)
3. [Tecnologies](#tecnologies)

---

## 1. Millores aplicades respecte al mockup

### Generals

- **Traducció automàtica:** sistema de traducció dinàmica que adapta l'idioma de la pàgina segons la selecció del desplegable de llengües. Permet canviar instantàniament entre idiomes sense recarregar la pàgina, mantenint l'estat i el context de l'usuari.
- **Uniformitat visual:** estils de background, botons, marges i tipografies ajustats per garantir una experiència consistent amb la resta del dashboard.
- **Feedback immediat:** notificacions automàtiques per informar l'usuari de l'estat de les operacions (confirmació, error o cancel·lació).
- **Missatges temporals:** en totes les parts de la web, els missatges d'error desapareixen automàticament després de 15 segons o en clicar la creu de tancament.

### Pàgina principal

El disseny de l'inici no ha canviat, però es destaca:

- **Secció de característiques:** efecte *hover* en passar per les característiques de Transportalia.
- **Botons d'acció:**
  - **Iniciar sessió:** porta a la pantalla d'inici de sessió.
  - **Play:** obre el pop-up del vídeo per poder veure'l.

### Pàgina Login / Recuperar contrasenya

- **Camps de text:** efecte *hover* en ser seleccionats.
- **Usuaris demo** disponibles a la part inferior:
  - Usuari normal: DNI `12345678A` / Contrasenya `1234`
  - Usuari bloquejat: DNI `99999999B` / Contrasenya `1234`
- **Botons d'acció:**
  - **Entrar:** porta al dashboard si les credencials són correctes, o mostra error.
  - **Has oblidat la contrasenya?:** porta a la pantalla de recuperació.
  - **Enviar (recuperació):** si l'usuari existeix, obre pop-up de confirmació.

### Pàgina del conductor loguejat / Dashboard

- **Hora del transport:** afegida per diferenciar transports del mateix dia amb el mateix origen.
- **Bloc del transport assignat** redissenyat:
  - Origen, destí i data disposen de més espai.
  - Indicador d'estat "Iniciat" a la cantonada superior dreta.
  - Botons de Cancel·lar i Finalitzar amb icones per ser més visuals.
  - El bloc ocupa més espai lateral.
- **Taula de transports:**
  - **Barra de cerca global:** permet cercar per qualsevol camp (ID, origen, destí, càrrega, pes, volum, data).
  - **Comptador** de transports disponibles/filtrats.
  - Efecte *hover* en passar per cada fila.
  - Icones identificadores per a cada columna.
  - **Paginació** per visualitzar més transports.
- **Botons d'acció:**
  - **Finalitzar:** porta a la pantalla de finalitzar transport.
  - **Cancel·lar:** porta a la pantalla de cancel·lar transport.
  - **Següent / Anterior:** canvia la pàgina de transports disponibles.
  - **Assignar:** obre pop-up de confirmació; si es confirma, passa al transport assignat.
- **Botó demo:** permet alternar entre l'estat sense camió assignat i camió assignat (no visible per al conductor final).

### Cancel·lació / Finalització

- **Gestió d'incidències** amb camp de text lliure per introduir observacions o motius de cancel·lació.
- **Control de distància interactiu** amb quatre modes d'entrada:
  - Movent la bola del slider.
  - Clicant en qualsevol punt de la línia.
  - Introduint el valor numèric manualment.
  - Usant les fletxes incrementals.
- **Botons d'acció:**
  - **Confirmar operació:** activa pop-up de confirmació.
  - **Cancel·lar operació:** redirigeix al llistat de camions mantenint la memòria de sessió.

### Dades d'usuari

- **Camps de text:** efecte *hover* en ser seleccionats.
- **Control d'incidències:**
  - El camp de telèfon només accepta números.
  - El camp d'email valida que contingui `@` i `.`; si no, mostra error.
  - Si hi ha error, la pàgina es desplaça automàticament cap amunt per mostrar-lo.
- **Botons d'acció:**
  - **Enrere:** torna a la pàgina anterior.
  - **Canviar fotografia / Canviar carnet:** obre una finestra del sistema per seleccionar la imatge i l'actualitza.
  - **Confirmar:** obre pop-up de confirmació i, si s'accepta, guarda les dades de l'usuari.

---

## 2. Interaccions de la web

### 2.1 Funcionals

- **Breadcrumb:** navegació entre seccions mantenint el context visual i funcional.
- **Perfil d'usuari:** desplegable amb opcions de configuració i idioma, accessible des de qualsevol pàgina.
- **Canvi d'idioma:** sincronitzat amb el sistema de traducció automàtica, garantint coherència textual.
- **Logo corporatiu** amb navegació contextual:
  - A la pàgina d'inici o d'introducció d'usuari → redirigeix al home públic.
  - A qualsevol secció interna → porta directament a l'apartat del dashboard.
- **Cancel·lació i finalització:**
  - Barra de distància interactiva amb retroalimentació visual immediata.
  - Botons amb efectes *hover* (cursor canviat i il·luminació).
  - Sistema de notificacions automàtiques amb missatges contextuals.
  - Gestió d'errors: detecta la manca de dades obligatòries i mostra alertes visuals temporals o tancables manualment.

### 2.2 No funcionals

- **Barra de cerca global:** permet cercar qualsevol camp dels transports directament (ID, origen, destí, càrrega, pes, volum, data).
- **Filtres de cerca:** permeten filtrar els transports per camps concrets (origen, volum, etc.) simultàniament.

---

## Tecnologies

- **React 18** + **Vite**
- **React Router v6**
- **Lucide React** (icones)
- CSS personalitzat amb variables de disseny

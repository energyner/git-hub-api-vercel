GIT-HUB-API-VERCEL

A Global Platform of Multiple APIs — A Microservices Hub.

Project Mission and Vision

The new Energyner project evolves from an isolated application into a scalable, high-performance microservices infrastructure. Through the `git-hub-api-vercel` repository, we decouple business logic to construct an API Hub capable of processing critical data across multiple dimensions of knowledge.

The horizon of this project transcends conventional software development; we aspire to establish an integration platform where modular APIs can agilely transform into Progressive Web Apps (PWAs) downloadable on any mobile device.

Our mission is to democratize access to specialized calculation and analysis tools, creating an environment that is as intuitive for the general public as it is powerful and engaging for the developer community—what we have termed "A Hub for Knowledge and Collaboration."

Structure: Project File Explorer. Classification of assets into common resources versus those specific to each individual API.

•	git-hub-api-vercel/
•	.vercel/
•	api/ 
	o	serv-energy-consump.mjs 
	o	translate.mjs
	o	_calculations/ <-- Funciones.
			calories-burned.mjs
			energy-consumption.mjs
			...others
	o	config/
			localdb-config.mjs
			apikey.mjs
•	public/ <-- Vercel sirve esto como estático automáticamente.
	o	assets/
			css
			doc
			img
			js
	o	energy-consump-app/
			index.html (Pagina HTML propia de la aplicación)
			energy-consump.js
			sw.js
			manifest.json
			style.css
	o	Others APIs

	o	index.html (Entrada HTML común del HUB de Apis)
•	node-modules
•	.env.local
•	.gitignore
•	package-loc.json
•	package.json
•	vercel.json 
•	README.md
•	index.html

The file system adheres to the concept of "Separation of Concerns":

a) Isolation of Mathematical Logic: It highlights that `energy-consump-function.mjs` has no knowledge of HTML or APIs; it consists of pure mathematics. This ensures that if a decision is made in the future to switch from Express to a different framework, the calculation logic remains untouched.

b) The Concept of Dynamic Injection: It explains that `load_all_home.js` acts as a dependency injector. It does not load the entire site at once; instead, it "fetches" the necessary components (e.g., `menu_home.html`, `footer.html`) only when they are required.

c) Security Safeguard: It notes that the "Hidden Zone" must be protected by a `.gitignore` file. This constitutes a vital security requirement: "Anything specific to the API—and containing secrets—must never leave the server."


Autor: Rene F. Ruano

04/10/2026  




// Configuração de API - ponto central para chamadas HTTP JSON
// Ajuste a URL base conforme o endereço do seu backend Spring Boot
window.apiConfig = {
	baseUrl: (function() {
		// Tente inferir a URL base: se estiver servindo local, a porta comum do backend é 8080
		// Você pode sobrescrever manualmente: localStorage.setItem('apiBaseUrl', 'http://localhost:8080');
		const saved = localStorage.getItem('apiBaseUrl');
		if (saved) return saved;
		return 'http://localhost:8080';
	})(),
	async json(path, options = {}) {
		const url = `${this.baseUrl}${path}`;
		const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
		const resp = await fetch(url, { ...options, headers });
		if (!resp.ok) {
			const text = await resp.text().catch(() => '');
			throw new Error(`HTTP ${resp.status} - ${text || resp.statusText}`);
		}
		const contentType = resp.headers.get('content-type') || '';
		if (contentType.includes('application/json')) {
			return resp.json();
		}
		return resp.text();
	}
};

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Deploy with GitHub Actions

This project is a Vite static frontend. The GitHub Actions workflow in `.github/workflows/deploy.yml` builds the project, uploads the generated `dist/` files as an archive, and extracts them on the server over SSH.

### Server prerequisites

1. Install Nginx on the server.
2. Create a deploy directory. The workflow defaults to `/var/www/diverge`.
3. Make sure the SSH deploy user can write to that directory.
4. Point Nginx to the deploy directory.

Example Nginx config:

```nginx
server {
	listen 80;
	server_name example.com;

	root /var/www/diverge;
	index index.html;

	location / {
		try_files $uri $uri/ /index.html;
	}
}
```

### GitHub repository secrets

Add these secrets in GitHub under `Settings -> Secrets and variables -> Actions`:

| Secret            | Example          | Description                                      |
| ----------------- | ---------------- | ------------------------------------------------ |
| `SSH_HOST`        | `1.2.3.4`        | Server IP or domain                              |
| `SSH_PORT`        | `22`             | SSH port                                         |
| `SSH_USER`        | `deploy`         | SSH deploy user                                  |
| `SSH_PRIVATE_KEY` | private key text | Private key allowed to log in as the deploy user |

### GitHub repository variables

The deployment directory is configured separately as a repository variable because it is not sensitive.

Add this variable under `Settings -> Secrets and variables -> Actions -> Variables`:

| Variable      | Default            | Description               |
| ------------- | ------------------ | ------------------------- |
| `DEPLOY_PATH` | `/var/www/diverge` | Directory served by Nginx |

The workflow runs on pushes to `main` or `master`. Push deployments use `DEPLOY_PATH`, or `/var/www/diverge` if the variable is not set. Manual deployments can override the directory from the Actions tab by filling `deploy_path`; leave it blank to use the repository variable. If `DEPLOY_PATH` was previously added as a secret, the workflow also supports that as a fallback.

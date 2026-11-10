# HIRO DEV — Portfolio

Portfolio basé sur [EmDash](https://github.com/emdash-cms/emdash), Astro et Node.js.

## Démarrer localement

Prérequis : Bun `1.3.14`, Docker avec Docker Compose, Cog, et un fichier `.env` créé à partir de `.env.example`.

```bash
cp .env.example .env
docker compose -f compose.dev.yml up -d
bun install --frozen-lockfile
cog install-hook pre-commit
bun run dev
```

Pour le développement local, renseigner `LIBSQL_DATABASE_URL=http://localhost:8080` dans `.env`, puis configurer les secrets et les services requis par EmDash et le stockage S3. L'administration est disponible sur `http://localhost:4321/_emdash/admin`.

Les migrations EmDash sont appliquées automatiquement en développement. Utiliser `compose.dev.yml` uniquement pour l'infrastructure locale ; la composition de production est utilisée par le déploiement Dokploy.

## Réseau de production

libSQL est uniquement relié au réseau Docker interne `portfolio-data`. Dans Dokploy, le conteneur de l'application doit rejoindre à la fois ce réseau et le réseau du proxy public ; aucun autre service ne doit rejoindre `portfolio-data`. La base de données ne doit jamais publier le port `8080` sur l'hôte de production.

### Politique d'accès à la base

L'instance libSQL n'utilise pas encore d'authentification applicative. Cette exception de sécurité est acceptée uniquement si l'isolation du réseau `portfolio-data` est vérifiée dans Dokploy avant chaque déploiement. Avant toute mise à jour EmDash ou migration, créer et vérifier une sauvegarde restaurable de la base et des médias ; une exportation JSON seule ne suffit pas à une restauration complète.

Pour supprimer cette exception, configurer `SQLD_AUTH_JWT_KEY` (ou `SQLD_AUTH_JWT_KEY_FILE`) sur libSQL, stocker le JWT applicatif dans les secrets Dokploy, puis transmettre ce dernier à `libsql({ authToken })` dans la configuration Astro. Ne jamais placer cette clé ou ce jeton dans le dépôt.

## Commandes de qualité

| Commande | Usage |
| --- | --- |
| `bun run check` | Vérifie formatage, lint, types et build sans modifier les sources. |
| `bun run format:check` | Vérifie le formatage uniquement. |
| `bun run lint` | Exécute le lint sans correction automatique. |
| `bun run fix` | Applique les corrections Biome disponibles. |
| `bun run build` | Produit le build Node de production. |

Le hook pre-commit exécute les vérifications rapides sans réécrire les fichiers. La CI utilise `bun run check`, ce qui assure le même résultat localement et sur GitHub.

## Organisation

- `src/pages`, `src/layouts` et `src/components` : surface Astro rendue côté serveur.
- `src/plugins/maintenance` : réglage EmDash et middleware de maintenance.
- `src/middleware.ts` : composition des middlewares transverses ; conserver les règles de chaque domaine dans son plugin.
- `seed/seed.json` : schéma et contenu de démarrage EmDash.

Les plugins restent internes à cette application : ils ne sont pas des packages publiés et ne nécessitent pas de monorepo tant qu'ils ne sont pas consommés par une autre application.

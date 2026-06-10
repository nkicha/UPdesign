# UltraPub Backend

Backend Spring Boot pour gestion clients, devis et commandes d'une agence publicitaire.

## Tech stack
- Java 21
- Spring Boot 3
- Spring Security
- JWT
- Spring Data JPA
- MySQL
- Maven
- Lombok
- Validation
- Swagger/OpenAPI
- OpenPDF

## Structure
- `controller`
- `service`
- `repository`
- `entity`
- `dto`
- `config`
- `security`
- `exception`
- `utils`

## Prérequis
- **Java 21+** - [Installer Temurin OpenJDK 21](https://adoptium.net/temurin/releases/?version=21)
- **Maven 3.9.6+** - [Installer Maven](https://maven.apache.org/download.cgi)
- **MySQL** configuré et en cours d'exécution

### Installation rapide
Voir le fichier `INSTALLATION-JAVA-MAVEN.md` pour les instructions détaillées.

## Lancer le projet
1. Vérifier Java et Maven : `java -version` et `mvn --version`
2. Configurer `backend/src/main/resources/application.properties` avec votre base MySQL.
3. Créer la base `ultrapub` ou exécuter `mysql-schema.sql`.
4. Depuis le dossier `backend` :
   - `mvn clean package`
   - `mvn spring-boot:run`
5. Ouvrir Swagger : `http://localhost:8080/swagger-ui.html`

### Utiliser le Maven Wrapper (pas besoin d'installer Maven)
```bash
# Windows
.\mvnw.cmd clean package

# Linux/Mac
./mvnw clean package
```

## Endpoints principaux
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/devis`
- `POST /api/devis`
- `GET /api/devis/{id}/pdf`
- `GET /api/commandes`
- `GET /api/dashboard`

## Exemples de requêtes
### Auth register
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

### Auth login
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

### Create client
```json
{
  "nom": "Agence Exemple",
  "telephone": "+33 6 12 34 56 78",
  "email": "client@example.com",
  "adresse": "12 Rue de Paris, 75001 Paris",
  "societe": "Agence Exemple"
}
```

### Create devis
```json
{
  "clientId": 1,
  "typePanneau": "Affichage 4x3",
  "dimensions": "400x300 cm",
  "matiere": "Vinyle",
  "prix": 1250.50,
  "description": "Devis pour panneau publicitaire centre-ville",
  "statut": "EN_COURS"
}
```

### Create commande
```json
{
  "clientId": 1,
  "typePanneau": "Totem LED",
  "dimensions": "150x50 cm",
  "matiere": "Métal + Plexi",
  "prix": 2400.00,
  "statut": "EN_COURS"
}
```

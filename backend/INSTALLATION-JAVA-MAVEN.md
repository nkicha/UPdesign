# Guide Installation Java 21 + Maven 3.9.6

## 1️⃣ Installer Java 21 (OpenJDK Temurin)

### Option A : Installer directement (Recommandé)
1. Accéder à : https://adoptium.net/temurin/releases/?version=21
2. Télécharger **Windows x64 MSI Installer** (Java 21)
3. Exécuter l'installeur .msi
4. **Important** : Cocher l'option "Set JAVA_HOME variable" pendant l'installation

### Option B : Via choco ou scoop
```powershell
# Avec Chocolatey (si installé)
choco install temurin21

# Avec Scoop
scoop install temurin21
```

## 2️⃣ Installer Maven 3.9.6

### Option A : Installer directement
1. Accéder à : https://maven.apache.org/download.cgi
2. Télécharger **apache-maven-3.9.6-bin.zip**
3. Extraire dans `C:\Program Files\apache-maven-3.9.6`
4. Ajouter Maven au PATH Windows :
   - Ouvrir "Variables d'environnement"
   - Ajouter `C:\Program Files\apache-maven-3.9.6\bin` au PATH

### Option B : Via choco
```powershell
choco install maven
```

## 3️⃣ Vérifier l'installation

```powershell
java -version
mvn --version
```

Vous devriez voir :
```
java version "21.0.x" ...
Apache Maven 3.9.6 ...
```

## 4️⃣ Compiler le backend

```powershell
cd c:\Users\HP\UPDesign\backend
mvn clean compile
```

## 5️⃣ Alternative : Utiliser le Maven Wrapper (inclus)

```powershell
# Windows
c:\Users\HP\UPDesign\backend\mvnw.cmd clean compile

# Linux/Mac
./mvnw clean compile
```

Le wrapper téléchargera automatiquement Maven à la première utilisation.

---

## Liens directs

- **Java 21 Temurin** : https://adoptium.net/temurin/releases/?version=21
- **Maven 3.9.6** : https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip

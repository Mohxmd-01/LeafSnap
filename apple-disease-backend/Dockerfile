# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml . 
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# ---------- RUN STAGE ----------
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Use environment variables for DB credentials
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://apple-postgres:5432/leafsnap
ENV SPRING_DATASOURCE_USERNAME=leafsnap_user
ENV SPRING_DATASOURCE_PASSWORD=T0fEiuzSqaIpEeMd7QS2MYjfsZD4UZMA
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_JPA_SHOW_SQL=true
ENV SPRING_JPA_PROPERTIES_HIBERNATE_JDBC_TIME_ZONE=Asia/Kolkata

EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]

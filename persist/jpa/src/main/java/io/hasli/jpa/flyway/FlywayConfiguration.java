package io.hasli.jpa.flyway;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.inject.Singleton;
import javax.sql.DataSource;

/**
 * Created by haswell on 10/17/16.
 */
@Configuration
public class FlywayConfiguration {

    @Singleton
    @Bean(initMethod = "migrate")
    public Flyway createMigrations(DataSource dataSource) {
        final Flyway flyway = new Flyway();
        flyway.setDataSource(dataSource);
        flyway.setLocations("classpath:h2");

        return flyway;
    }
}

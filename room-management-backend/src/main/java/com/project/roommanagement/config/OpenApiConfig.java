package com.project.roommanagement.config;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hệ thống quản lý phòng trọ API")
                        .version("1.0.0")
                        .description("Tài liệu API cho dự án quản lý phòng trọ & ký túc xá.")
                        .contact(new Contact()
                                .name("Thanh Le")
                                .email("thanhld69@gmail.com")
                                .url("https://github.com/yourrepo")
                        )
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")
                        )
                );
    }
}

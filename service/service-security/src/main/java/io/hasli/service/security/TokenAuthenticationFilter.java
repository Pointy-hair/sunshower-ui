package io.hasli.service.security;

import io.hasli.core.security.UserService;
import io.hasli.model.core.auth.User;
import io.hasli.service.security.crypto.MessageAuthenticationCode;
import io.hasli.vault.api.InvalidTokenException;
import io.hasli.vault.api.KeyProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.UUID;

/**
 * Created by haswell on 10/20/16.
 */
@Service
@Provider
public class TokenAuthenticationFilter implements
        ContainerResponseFilter,
        ContainerRequestFilter {

    public static final String HEADER_KEY = "X-AUTH-TOKEN";

    @Inject
    private KeyProvider keyProvider;

    @Inject
    private UserService userService;

    @Inject
    private MessageAuthenticationCode authenticationCodeProvider;


    @Override
    public void filter(
            ContainerRequestContext requestContext
    ) throws IOException {
        final String token = requestContext.getHeaderString(HEADER_KEY);
        if(token != null) {
            try {
                final String userId = authenticationCodeProvider.id(token);
                final UUID uuid = UUID.fromString(userId);
                final User user = userService.get(uuid);
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                user.getAuthorities()
                        ));
                System.out.println("USER: " + user.getAuthorities());
            } catch(InvalidTokenException ex) {
                ex.printStackTrace();
            }
        }

    }
    @Override
    public void filter(
            ContainerRequestContext requestContext,
            ContainerResponseContext responseContext
    ) throws IOException {

    }
}
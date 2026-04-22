package io.zoooohs.realworld.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JWTAuthFilter extends GenericFilter {
    public static final String TOKEN_PREFIX = "Token ";
    private final JwtUtils jwtUtils;
    private final AuthenticationProvider authenticationProvider;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI();
        
        if (path.contains("/h2-console") || path.contains("/api/h2-console")) {
            chain.doFilter(request, response);
            return;
        }
        
        Optional.ofNullable(httpRequest.getHeader(HttpHeaders.AUTHORIZATION))
                .filter(authHeader -> authHeader.startsWith(TOKEN_PREFIX))
                .map(authHeader -> authHeader.substring(TOKEN_PREFIX.length()))
                .filter(jwtUtils::validateToken)
                .map(jwtUtils::getSub)
                .map(authenticationProvider::getAuthentication)
                .ifPresent(SecurityContextHolder.getContext()::setAuthentication);
        chain.doFilter(request, response);
    }
}

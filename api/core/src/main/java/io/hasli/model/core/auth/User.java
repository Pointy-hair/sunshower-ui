package io.hasli.model.core.auth;

import io.hasli.model.core.entity.AbstractEntity;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import java.security.Principal;
import java.util.UUID;

@XmlRootElement(name = "user")
@XmlAccessorType(XmlAccessType.NONE)
public class User extends AbstractEntity<UUID> {

    private Details details;

    @XmlAttribute
    private String username;

    @XmlAttribute
    private String password;

    public User() {
        super(null);
    }

    public User(UUID uuid) {
        super(uuid);
    }

    @Override
    protected void setDefaults() {

    }

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean equals(Object obj) {
        return false;
    }

    @Override
    public String toString() {
        return null;
    }
}

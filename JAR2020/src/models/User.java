package models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class User implements Serializable{
	
	private String username;
	private String password;
	private List<String> inbox = new ArrayList<>();
	private Host host;
	
	public User() {
		
	}	

	public User(String username, String password, List<String> inbox) {
		super();
		this.username = username;
		this.password = password;
		this.inbox = inbox;
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
	
	public List<String> getInbox() {
		return inbox;
	}

	public void setInbox(List<String> inbox) {
		this.inbox = inbox;
	}
	

	public Host getHost() {
		return host;
	}

	public void setHost(Host host) {
		this.host = host;
	}

	@Override
	public String toString() {
		return "User [username=" + username + ", password=" + password + "]";
	}
	

}

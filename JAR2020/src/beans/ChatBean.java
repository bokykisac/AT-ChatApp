package beans;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.jms.ConnectionFactory;
import javax.jms.Queue;
import javax.jms.QueueConnection;
import javax.jms.QueueSender;
import javax.jms.QueueSession;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import models.User;
import ws.WSEndPoint;


@Stateless
@Path("/chat")
@LocalBean
public class ChatBean implements ChatRemote, ChatLocal {
	
	@EJB
	WSEndPoint ws;
	
	private List<User> users = new ArrayList<>();
	
	private List<User> loggedIn = new ArrayList<>();


	@GET
	@Path("/test")
	@Produces(MediaType.TEXT_PLAIN)
	public String test() {
		return "OK";
	}

	@POST
	@Path("/post/{text}")
	@Produces(MediaType.TEXT_PLAIN)
	public String post(@PathParam("text") String text) {
		System.out.println("Received message: " + text);
		ws.echoTextMessage(text);
		return "OK";
	}
	
	@POST
	@Path("/users/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public Response register(User user) {
		
		for(User u : users) {
			if(user.getUsername().equals(u.getUsername())) {
				System.out.println("Korinsik sa username-om " + user.getUsername() + " vec postiji.");
				return Response.status(400).entity("Username already in use").build();
			}
		}
		this.users.add(user);
		System.out.println("Korisnik " + user.getUsername() + " se uspesno registrovao.");
		return Response.status(200).build();
			
	}
	
	@POST
	@Path("/users/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public Response login(User user) {
		
		System.out.println(loggedIn.size());
		
		for(User u : users) {
			if(user.getUsername().equals(u.getUsername()) && u.getPassword().equals(user.getPassword())) {
				if(this.loggedIn.size() == 0) {
					this.loggedIn.add(user);
					System.out.println("Dodao korisnika u listu logovanih korinsika");
				}
				else {
					List<User> toBeAdded = new ArrayList<>();
					for(User loggedUser : loggedIn) {
						if(!(user.getUsername().equals(loggedUser.getUsername()))){
							toBeAdded.add(user);
							System.out.println("Dodao korisnika u listu logovanih korinsika");
						}
					}
					this.loggedIn.addAll(toBeAdded);
				}
				
				System.out.println("ZASTO EROR");
				
				System.out.println("Korisnik " + user.getUsername() + " se uspesno logovao");				
				return Response.status(200).build();
			}
		}
		
		System.out.println("Neuspesan login od korisnika " + user.getUsername());
		return Response.status(400).entity("Pogresan username/password.").build();
	}
	
	@DELETE
	@Path("/users/loggedIn/{user}")
	@Produces(MediaType.TEXT_PLAIN)
	public Response logout(@PathParam("user") String user) {
		
		for(User u : loggedIn) {
			if(u.getUsername().equals(user)) {
				loggedIn.remove(u);
				System.out.println("Korisnik " + user + " se izlogovao");
				return Response.status(200).build();
			}
		}
		System.out.println("Doslo je do greske prilikom logoutovanja.");
		return Response.status(400).entity("User not exists").build();
	}
	
	@GET
	@Path("/users/loggedIn")
	public void getLoggedUsers() {
		
		System.out.println("Ukupno logovanih korisnika: " + loggedIn.size());
		
		for(User u : loggedIn) {
			System.out.println("LOGOVAN: " + u.getUsername());
		}
	}
	
	@GET
	@Path("/users/registered")
	public void getRegisteredUsers() {
		
		System.out.println("Ukupno registrovanih korisnika: " + users.size());
		
		for(User u : users) {
			System.out.println("REGISTROVAN: " + u.getUsername());
		}
	}
	
	
	
}

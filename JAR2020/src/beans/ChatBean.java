package beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import models.Message;
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
	
	private List<Message> messages = new ArrayList<>();


//	@GET
//	@Path("/test")
//	@Produces(MediaType.TEXT_PLAIN)
//	public String test() {
//		return "OK";
//	}

	@POST
	@Path("/messages/all")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response sendMessageToAll(Msg msg) {
		
		User sender = null;
		
		for(User u : users) {
			if(u.getUsername().equals(msg.sender)) {
				sender = u;
			}
		}
		
		if(sender != null) {
			for(User u : users) {
				Message message = new Message(u, sender, new Date(), msg.subject, msg.message);
				this.messages.add(message);
			}
			System.out.println("Poslao poruku svim korisnicima: " + msg.message);
//			ws.echoTextMessage(msg.message);
			return Response.status(200).build();
		}
		else {
			System.out.println("Doslo je do greske prilikom slanja poruke");
			return Response.status(400).build();
		}
	}
	
	@POST
	@Path("/messages/user")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response sendMessageToUser(Msg msg) {
		
		User sender = null;
		
		for(User u : users) {
			if(u.getUsername().equals(msg.sender)) {
				sender = u;
			}
		}
		
		if(sender != null) {
			for(User reciver : loggedIn) {
				if(msg.reciver.equals(reciver.getUsername())) {
					Message message = new Message(reciver, sender, new Date(), msg.subject, msg.message);
					this.messages.add(message);
					System.out.println("Poruka poslata korisniku " + reciver.getUsername());
					return Response.status(200).build();
				}
			}
			System.out.println("Neuspesno slanje poruke.");
			return Response.status(400).build();
		}else {
			System.out.println("Nije pronasao korisnika");
			return Response.status(400).build();
		}
	}
	
	@GET
	@Path("/messages/{user}")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getAllMessages(@PathParam("user") String user) {
		
		System.out.println("Inbox od korisnika " + user);
		
		List<Message> inbox = new ArrayList<>();
		
		for(Message m : messages) {
			if(user.equals(m.getReciver().getUsername())) {
				inbox.add(m);
				System.out.println(m.getMessage());
			}
		}

		return Response.status(200).entity(inbox).build();
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
	public Response login(User user) {
		
		for(User logged : loggedIn) {
			if(user.getUsername().equals(logged.getUsername())){
				System.out.println("Korisnik " + user.getUsername() + " se uspesno logovao");				
				return Response.status(200).entity(this.loggedIn).build();
			}
		}
		
		for(User u : users) {
			if(user.getUsername().equals(u.getUsername()) && u.getPassword().equals(user.getPassword())) {
				if(this.loggedIn.size() == 0) {
					this.loggedIn.add(user);
					System.out.println("Dodao korisnika u listu logovanih korinsika");
				}
				else {
					for(User logged : loggedIn) {
						if(user.getUsername().equals(logged.getUsername())){
							System.out.println("Korisnik " + user.getUsername() + " se uspesno logovao");				
							return Response.status(200).entity(this.loggedIn).build();
						}
					}
					List<User> toBeAdded = new ArrayList<>();
					for(User loggedUser : loggedIn) {
						if(!(user.getUsername().equals(loggedUser.getUsername()))){
							toBeAdded.add(user);
							System.out.println("Dodao korisnika u listu logovanih korinsika");
						}
					}
					this.loggedIn.addAll(toBeAdded);
				}
				
				System.out.println("Korisnik " + user.getUsername() + " se uspesno logovao");				
				return Response.status(200).entity(this.loggedIn).build();
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
	public Response getLoggedUsers() {
		
		System.out.println("Ukupno logovanih korisnika: " + loggedIn.size());
		
		for(User u : loggedIn) {
			System.out.println("LOGOVAN: " + u.getUsername());
		}
		
		return Response.status(200).entity(this.loggedIn).build();
	}
	
	@GET
	@Path("/users/registered")
	public void getRegisteredUsers() {
		
		System.out.println("Ukupno registrovanih korisnika: " + users.size());
		
		for(User u : users) {
			System.out.println("REGISTROVAN: " + u.getUsername());
		}
	}
	
	static public class Msg {
		public String message;
		public String reciver;
		public String sender;
		public String subject;
	}
	
}

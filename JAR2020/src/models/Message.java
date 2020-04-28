package models;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable {
	
	private User reciver;
	private User sender;
	private Date msgDate;
	private String subject;
	private String message;
	
	public Message() {
		
	}
	
	

	public Message(User reciver, User sender, Date msgDate, String subject, String message) {
		super();
		this.reciver = reciver;
		this.sender = sender;
		this.msgDate = msgDate;
		this.subject = subject;
		this.message = message;
	}



	public User getReciver() {
		return reciver;
	}

	public void setReciver(User reciver) {
		this.reciver = reciver;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public Date getMsgDate() {
		return msgDate;
	}

	public void setMsgDate(Date msgDate) {
		this.msgDate = msgDate;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}



	@Override
	public String toString() {
		return "Message [reciver=" + reciver + ", sender=" + sender + ", msgDate=" + msgDate + ", subject=" + subject
				+ ", message=" + message + "]";
	}
	
	
	
	

}

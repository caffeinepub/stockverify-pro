import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";

actor {
  type Submission = {
    name : Text;
    company : Text;
    phone : Text;
    email : Text;
    message : Text;
  };

  module Submission {
    public func compare(submission1 : Submission, submission2 : Submission) : Order.Order {
      switch (Text.compare(submission1.name, submission2.name)) {
        case (#equal) { Text.compare(submission1.email, submission2.email) };
        case (order) { order };
      };
    };
  };

  let submissions = List.empty<Submission>();

  public shared ({ caller }) func submit(name : Text, company : Text, phone : Text, email : Text, message : Text) : async () {
    let newSubmission : Submission = {
      name;
      company;
      phone;
      email;
      message;
    };
    submissions.add(newSubmission);
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.toArray().sort();
  };
};

import Array "mo:base/Array";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor Smaakenzzo {

  type OrderItem = {
    name: Text;
    price: Nat;
    quantity: Nat;
  };

  type OrderStatus = { #pending; #sent_to_counter; #paid };

  type Order = {
    id: Nat;
    items: [OrderItem];
    total: Nat;
    status: OrderStatus;
    tableNote: Text;
    timestamp: Int;
  };

  stable var nextId: Nat = 1;
  stable var orders: [Order] = [];

  public func placeOrder(items: [OrderItem], total: Nat, tableNote: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let order: Order = {
      id;
      items;
      total;
      status = #pending;
      tableNote;
      timestamp = Time.now();
    };
    orders := Array.append(orders, [order]);
    id
  };

  public func updateOrderStatus(id: Nat, newStatus: OrderStatus) : async Bool {
    var found = false;
    orders := Array.map<Order, Order>(orders, func(o) {
      if (o.id == id) {
        found := true;
        { o with status = newStatus }
      } else o
    });
    found
  };

  public query func getOrders() : async [Order] {
    orders
  };

  public query func getPendingOrders() : async [Order] {
    Array.filter<Order>(orders, func(o) {
      switch (o.status) {
        case (#pending or #sent_to_counter) true;
        case _ false;
      }
    })
  };

  public func markPaid(id: Nat) : async Bool {
    await updateOrderStatus(id, #paid)
  };

};

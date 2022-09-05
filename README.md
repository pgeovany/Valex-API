#### **POST** - Generating a new card

In order to generate a card, make a post request to: https://valex1.herokuapp.com/cards
sending a body in the format:

```
{
  employeeId: number,
  cardType: string,
}
```
and a **x-api-key** header containing the API key of the company making the request.

The server will respond with an object in the format:
```
{
  cardId: number,
  cardholderName: string,
  number: string,
  cvv: string,
  type: string,
}
```

#### **PATCH** - Activating a card

In order to activate a card, make a patch request to: https://valex1.herokuapp.com/cards/activate
sending a body in the format:

```
{
  id: number,
  cvv: number,
  password: number,
}
```

#### **PATCH** - Blocking a card

In order to block a card, make a patch request to: https://valex1.herokuapp.com/cards/block
sending a body in the format:

```
{
  id: number,
  password: string,
}
```

#### **PATCH** - Unblocking a card

In order to unblock a card, make a patch request to: https://valex1.herokuapp.com/cards/unblock
sending a body in the format:

```
{
  id: number,
  password: string,
}
```

#### **GET** - Listing a card's payments, recharges and balance

In order to get a list of the payments, recharges and the balance of a card, make a get request to: https://valex1.herokuapp.com/cards/:cardId
sending the **card id** as a request param.<br><br>
The server will respond with a object in the format:
```
{
  balance: number,
  transactions: [],
  recharges: [],
}
```


#### **POST** - Recharging a card

In order to recharge a card, make a post request to: https://valex1.herokuapp.com/cards/recharge
sending a body in the format:

```
{
  id: number,
  amount: number,
}
```

and a **x-api-key** header containing the API key of the company making the request.


#### **POST** - Payments

In order to make a payment, make a post request to: https://valex1.herokuapp.com/payment
sending a body in the format:

```
{
  cardId: number
  cardPassword: string,
  businessId: number,
  amount: number,
}
```


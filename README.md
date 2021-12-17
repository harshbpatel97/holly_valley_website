<center><h1> OM EXPRESS </h1></center>
<p>
  

Om Express is a gas station-cum-retail convenience store which has been providing excellent customer service for the past ten years. It offers variety of products and services ranging from gas to drinks.
The store is located in North Wilkesboro town of North Carolina on 268 Elkin Highway.

</p>

<h2>Website Overview </h2>
<ul>
  <li>The main purpose of this website is to increase the popularity of the retail store among the local public.</li>
  <li>It will help the customer to easily see the products which are available at this store. </li>
  <li>Users will also see the weekly deals offered at the store.</li>
  <li>The intended users of this website are customers from all categories ranging from students to senior citizens and the business owner. </li>
  <li>The website will contain the list of products and services sold at the retail convenience store along with contact and about the owner section too.</li>
</ul>

<h2>Interactive Features </h2>
<p>There are various interactive features implemented on the website. Some of the key ones are listed below:<p>
<ul>
  <li>There were two major <b>JQuery plugins</b> used on the website: <i>box_slider</i> and <i>image-zoom</i>, and for the <b>JQuery-UI widget</b> part, the <i>accordion</i> has been incorporated in the website.</li>
    <ul>
      <li>The <i>box_slider</i> plugin is used on the home (index) page to serve the purpose of displaying the images of the store with different views i.e. front, side, and inside, 
which can be scrolled to next/previous one by clicking on the respective icon.</li>
      <li>The <i>image-zoom</i> plugin is incorporated on the products page under the groceries, tobacco, cigarettes, alcohols, and soft-drinks sections which can be easily seen by 
hovering on the images under those sections. This assists the user in zooming the 
image to clearly recognize the brand or the product. </li>
      <li>The <i>accordion</i> widget is enabled on the services, products, and deals pages where all the subsection contents are wrapped around this plugin. It aids in displaying 
not too many contents all at once on the webpages, instead, it assists the user to 
display the content that they wanna see i.e. when they click on it expands and if 
they want it to contract, just click on it once again.</li>
    </ul>
  <li>There were two <b>AJAX requests</b> made on the website: one from the <i>local JSON file</i> and another from an <i>external Flickr API</i> call.</li>
    <ul>
      <li> Under the <i>"Weekly Ads"</i> section of the deals page, the data which includes the item name, price, and the image is read from an external JSON file 
<i>(dealItems.json)</i> which is read and displayed in this section. This Ajax request assists in displaying the information related to deals going every week at the store 
by displaying the deal price and product name along with its image. Thereby, 
making it easier for the customer to understand the deal. Moreover, all the values can be easily changed every week by changing the value of the <i>dealItems.json file</i>.</li>
      <li>Another call was made on the same page under the <i>"Clearance"</i> section where the images and their captions are loaded using Flickr API which is called using AJAX 
and parsed and displayed on the website. This ajax request related to the 
Clearance section aids in displaying the items that are currently on clearance aisle 
and that can be easily updated by changing the images on the Flickr account and 
that change is automatically reflected on the website as it makes the call from the 
Flickr</li>
    </ul>
</ul>

<h2>How the website meets the requirements</h2>
<ul>
  <li>The main purpose of creating this website is to increase the popularity of the retail store 
among the local public of Wilkesboro. </li>
  <li>The website consists of five webpages:- home(index), services, products, deals, and 
contact us.</li>
  <li>The home page provides an overview of the retail store through contents like about us, 
address, and hours of operation.</li>
  <li>The service page covers all the services provided by the store i.e. gas services, accepted 
forms of payments, ATM, and NC Lottery. </li>
  <li>The products page consists of the description of all the products offered at the store 
which is divided and displayed under different categories such as groceries, tobacco, 
cigarettes, alcohols, and soft-drinks. </li>
  <li>The deals page focuses on the weekly deals as well as the clearance section of the items 
currently at the store. Moreover, there is a subscription form where the user can signup to 
get alerts of the weekly deals and clearance items.</li>
  <li>The contacts page provides information on what are the different means through which a 
dealer or customer can get into contact with the owner like the phone number, location, 
or even there is a form where they can submit their message which will be quickly 
responded by the owner. </li>
</ul>

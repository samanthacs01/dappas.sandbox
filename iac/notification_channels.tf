module "notification_channels" {
  source = "./modules/notification_channel"

  email_channels = {
    samantha = {
      email_address = "samantha.cs@yareytech.com"
    },
    sade = {
      email_address = "sade@yareytech.com"
    }
    # pedro = {
    #   email_address = "pedro@yareytech.com"
      
    # }
    # dena = {
    #   email_address = "dena@yareytech.com"
      
    # }
    # chao = {
    #   email_address = "chao@yareytech.com"
      
    # }
    # yoan = {
    #   email_address = "yoan@yareytech.com"
      
    # }
  }
}
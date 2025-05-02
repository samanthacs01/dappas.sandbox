locals {
# NETWORK
  vpc_name = lookup(var.vpc_name, terraform.workspace, var.vpc_name["default"])
  is_vpc_enabled = lookup(var.is_vpc_enabled, terraform.workspace, var.is_vpc_enabled["default"])
  subnet_name = lookup(var.subnet_name, terraform.workspace, var.subnet_name["default"])
  priv_sql_name = lookup(var.priv_sql_name, terraform.workspace, var.priv_sql_name["default"])
  internal_address_name = lookup(var.internal_address_name, terraform.workspace, var.internal_address_name["default"])
  nat_router_name = lookup(var.nat_router_name, terraform.workspace, var.nat_router_name["default"]) 
  nat_config_name = lookup(var.nat_config_name, terraform.workspace, var.nat_config_name["default"]) 
  cidr_dappas_subnet = lookup(var.cidr_dappas_subnet, terraform.workspace, var.cidr_dappas_subnet["default"])
  cidr_priv_sql_dappas = lookup(var.cidr_priv_sql_dappas, terraform.workspace, var.cidr_priv_sql_dappas["default"])
  internal_address_dappas = lookup(var.internal_address_dappas, terraform.workspace, var.internal_address_dappas["default"])

}